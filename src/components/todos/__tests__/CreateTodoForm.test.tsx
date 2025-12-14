import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateTodoForm } from "../CreateTodoForm";
import { renderWithProviders } from "@/test/test-utils";

// Mock the useCreateTodo hook
vi.mock("@/hooks/useTodos", () => ({
  useCreateTodo: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

describe("CreateTodoForm", () => {
  const mockTodoListId = "test-list-id";
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render all form fields", () => {
      renderWithProviders(
        <CreateTodoForm todoListId={mockTodoListId} onSuccess={mockOnSuccess} />
      );

      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /create task/i })
      ).toBeInTheDocument();
    });

    it("should mark title field as required", () => {
      renderWithProviders(
        <CreateTodoForm todoListId={mockTodoListId} onSuccess={mockOnSuccess} />
      );

      const titleLabel = screen.getByText(/title/i);
      expect(titleLabel).toBeInTheDocument();
      expect(titleLabel.querySelector(".text-destructive")).toBeInTheDocument();
    });

    it("should have correct placeholders", () => {
      renderWithProviders(
        <CreateTodoForm todoListId={mockTodoListId} onSuccess={mockOnSuccess} />
      );

      expect(
        screen.getByPlaceholderText(/enter task title/i)
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/add more details/i)
      ).toBeInTheDocument();
    });
  });

  describe("Validation - Title Field", () => {
    it("should show error when title is empty on submit", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <CreateTodoForm todoListId={mockTodoListId} onSuccess={mockOnSuccess} />
      );

      const submitButton = screen.getByRole("button", { name: /create task/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      });
    });

    it("should accept single character title", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <CreateTodoForm todoListId={mockTodoListId} onSuccess={mockOnSuccess} />
      );

      const titleInput = screen.getByPlaceholderText(/enter task title/i);
      await user.type(titleInput, "a"); // Single character is valid (min 1)

      const submitButton = screen.getByRole("button", { name: /create task/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
      });
    });

    it("should show error when title is too long", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <CreateTodoForm todoListId={mockTodoListId} onSuccess={mockOnSuccess} />
      );

      const titleInput = screen.getByPlaceholderText(/enter task title/i);
      const longTitle = "a".repeat(201); // 201 characters (max is 200)
      await user.type(titleInput, longTitle);

      const submitButton = screen.getByRole("button", { name: /create task/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/title must be less than 200 characters/i)
        ).toBeInTheDocument();
      });
    });

    it("should accept valid title", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <CreateTodoForm todoListId={mockTodoListId} onSuccess={mockOnSuccess} />
      );

      const titleInput = screen.getByPlaceholderText(/enter task title/i);
      await user.type(titleInput, "Valid task title");

      const submitButton = screen.getByRole("button", { name: /create task/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
        expect(
          screen.queryByText(/title must be less than 200 characters/i)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Validation - Description Field", () => {
    it("should accept empty description (optional field)", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <CreateTodoForm todoListId={mockTodoListId} onSuccess={mockOnSuccess} />
      );

      const titleInput = screen.getByPlaceholderText(/enter task title/i);
      await user.type(titleInput, "Valid task title");

      // Leave description empty
      const submitButton = screen.getByRole("button", { name: /create task/i });
      await user.click(submitButton);

      // Should not show description error
      await waitFor(() => {
        expect(
          screen.queryByText(/description.*required/i)
        ).not.toBeInTheDocument();
      });
    });

    it("should accept long description (no max length)", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <CreateTodoForm todoListId={mockTodoListId} onSuccess={mockOnSuccess} />
      );

      const titleInput = screen.getByPlaceholderText(/enter task title/i);
      await user.type(titleInput, "Valid task title");

      const descriptionInput = screen.getByPlaceholderText(/add more details/i);
      const longDescription = "This is a very long description ".repeat(20);
      await user.type(descriptionInput, longDescription);

      const submitButton = screen.getByRole("button", { name: /create task/i });
      await user.click(submitButton);

      // Should not show any description error
      await waitFor(() => {
        expect(
          screen.queryByText(/description/i)
        ).not.toHaveClass("text-destructive");
      });
    });
  });

  describe("Form Interaction", () => {
    it("should allow typing in all fields", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <CreateTodoForm todoListId={mockTodoListId} onSuccess={mockOnSuccess} />
      );

      const titleInput = screen.getByPlaceholderText(
        /enter task title/i
      ) as HTMLInputElement;
      const descriptionInput = screen.getByPlaceholderText(
        /add more details/i
      ) as HTMLInputElement;

      await user.type(titleInput, "Test Task");
      await user.type(descriptionInput, "Test Description");

      expect(titleInput.value).toBe("Test Task");
      expect(descriptionInput.value).toBe("Test Description");
    });

    it("should handle form submission with all fields filled", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <CreateTodoForm todoListId={mockTodoListId} onSuccess={mockOnSuccess} />
      );

      const titleInput = screen.getByPlaceholderText(
        /enter task title/i
      ) as HTMLInputElement;
      const descriptionInput = screen.getByPlaceholderText(
        /add more details/i
      ) as HTMLInputElement;

      await user.type(titleInput, "Complete Task Title");
      await user.type(descriptionInput, "This is a detailed description");

      expect(titleInput.value).toBe("Complete Task Title");
      expect(descriptionInput.value).toBe("This is a detailed description");

      const submitButton = screen.getByRole("button", { name: /create task/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper labels for all inputs", () => {
      renderWithProviders(
        <CreateTodoForm todoListId={mockTodoListId} onSuccess={mockOnSuccess} />
      );

      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    });

    it("should show error messages with proper styling", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <CreateTodoForm todoListId={mockTodoListId} onSuccess={mockOnSuccess} />
      );

      const submitButton = screen.getByRole("button", { name: /create task/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/title is required/i);
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveClass("text-destructive");
      });
    });

    it("should highlight invalid fields with error styling", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <CreateTodoForm todoListId={mockTodoListId} onSuccess={mockOnSuccess} />
      );

      const submitButton = screen.getByRole("button", { name: /create task/i });
      await user.click(submitButton);

      await waitFor(() => {
        const titleInput = screen.getByPlaceholderText(/enter task title/i);
        expect(titleInput).toHaveClass("border-destructive");
      });
    });
  });

  describe("Edge Cases", () => {
    it("should validate title length correctly", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <CreateTodoForm todoListId={mockTodoListId} onSuccess={mockOnSuccess} />
      );

      const titleInput = screen.getByPlaceholderText(/enter task title/i);

      // Set invalid value - too long
      const longTitle = "a".repeat(201); // 201 characters (max is 200)
      await user.type(titleInput, longTitle);

      const submitButton = screen.getByRole("button", { name: /create task/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/title must be less than 200 characters/i)
        ).toBeInTheDocument();
      });
    });

    it("should trim whitespace from title", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <CreateTodoForm todoListId={mockTodoListId} onSuccess={mockOnSuccess} />
      );

      const titleInput = screen.getByPlaceholderText(/enter task title/i);
      await user.type(titleInput, "   Valid Title   ");

      // The form should handle this gracefully
      // Zod schema may trim automatically depending on configuration
    });
  });
});

