import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '../test/setup';
import { SafeForm } from '../forms/SafeForm';
import { formHelpers, setupUserEvent } from '../test/utils';
import { z } from 'zod';

const user = setupUserEvent();

describe('SafeForm', () => {
  const mockSubmit = vi.fn();
  
  const testSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
  });

  const TestForm = ({ onSubmit = mockSubmit }) => (
    <SafeForm
      schema={testSchema}
      onSubmit={onSubmit}
      className="test-form"
    >
      {({ register, formState: { errors, isSubmitting } }) => (
        <>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register('email')}
              aria-invalid={!!errors.email}
            />
            {errors.email && <span role="alert">{errors.email.message}</span>}
          </div>
          
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register('password')}
              aria-invalid={!!errors.password}
            />
            {errors.password && <span role="alert">{errors.password.message}</span>}
          </div>
          
          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              {...register('name')}
              aria-invalid={!!errors.name}
            />
            {errors.name && <span role="alert">{errors.name.message}</span>}
          </div>
          
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </>
      )}
    </SafeForm>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<TestForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('validates form data on submit', async () => {
    render(<TestForm />);

    // Submit empty form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('submits valid form data', async () => {
    render(<TestForm />);

    const validData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'John Doe',
    };

    await formHelpers.fillAndSubmitForm(validData);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(validData);
    });
  });

  it('sanitizes form data before submission', async () => {
    render(<TestForm />);

    const dataWithScript = {
      email: 'test@example.com',
      password: 'password123',
      name: '<script>alert("xss")</script>John Doe',
    };

    await formHelpers.fillAndSubmitForm(dataWithScript);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe', // Script should be sanitized
      });
    });
  });

  it('disables form during submission', async () => {
    const slowSubmit = vi.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 1000))
    );
    
    render(<TestForm onSubmit={slowSubmit} />);

    const validData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'John Doe',
    };

    await formHelpers.fillAndSubmitForm(validData);

    // Form should be disabled during submission
    formHelpers.expectFormDisabled();
    expect(screen.getByText(/submitting/i)).toBeInTheDocument();
  });

  it('handles submission errors gracefully', async () => {
    const errorSubmit = vi.fn().mockRejectedValue(new Error('Submission failed'));
    
    render(<TestForm onSubmit={errorSubmit} />);

    const validData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'John Doe',
    };

    await formHelpers.fillAndSubmitForm(validData);

    await waitFor(() => {
      expect(screen.getByText(/submission failed/i)).toBeInTheDocument();
    });
  });

  it('is keyboard accessible', async () => {
    render(<TestForm />);

    const emailField = screen.getByLabelText(/email/i);
    const passwordField = screen.getByLabelText(/password/i);
    const nameField = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Test tab navigation
    emailField.focus();
    expect(emailField).toHaveFocus();

    await user.keyboard('{Tab}');
    expect(passwordField).toHaveFocus();

    await user.keyboard('{Tab}');
    expect(nameField).toHaveFocus();

    await user.keyboard('{Tab}');
    expect(submitButton).toHaveFocus();
  });

  it('announces validation errors to screen readers', async () => {
    render(<TestForm />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      const errorMessages = screen.getAllByRole('alert');
      expect(errorMessages).toHaveLength(3);
      
      errorMessages.forEach(error => {
        expect(error).toBeInTheDocument();
      });
    });
  });

  it('supports custom validation messages', async () => {
    const customSchema = z.object({
      email: z.string().email('Please enter a valid email'),
    });

    const CustomForm = () => (
      <SafeForm schema={customSchema} onSubmit={mockSubmit}>
        {({ register, formState: { errors } }) => (
          <>
            <label htmlFor="email">Email</label>
            <input id="email" {...register('email')} />
            {errors.email && <span role="alert">{errors.email.message}</span>}
            <button type="submit">Submit</button>
          </>
        )}
      </SafeForm>
    );

    render(<CustomForm />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
    });
  });
});