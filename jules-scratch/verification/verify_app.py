from playwright.sync_api import sync_playwright, Page, expect

def run_verification(page: Page):
    """
    This script verifies the main functionality of the text-to-handwriting app.
    It checks that the new UI loads, that text can be entered, and that an image
    is generated successfully.
    """
    # 1. Arrange: Go to the application's homepage.
    page.goto("http://localhost:3000")

    # 2. Act: Interact with the page to generate handwriting.

    # Wait for the main heading to be visible, to ensure the page is loaded.
    heading = page.get_by_role("heading", name="Text to Handwriting")
    expect(heading).to_be_visible(timeout=15000)

    # Wait for the main editor to be ready and type some text.
    # Use a more specific selector to target the main content editor.
    editor_locator = page.locator('.paper-content [data-slate-editor="true"]')
    expect(editor_locator).to_be_visible(timeout=10000)
    editor_locator.type("Hello, this is a test of the new UI.")

    # Find the "Generate Image" button and click it.
    generate_button = page.get_by_role("button", name="Generate Image")
    expect(generate_button).to_be_enabled()
    generate_button.click()

    # 3. Assert: Confirm that an image was generated.
    # We wait for an image to appear in the output container.
    output_image_locator = page.locator(".output-images img").first
    expect(output_image_locator).to_be_visible(timeout=10000) # Generation can take time

    # 4. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")

# Boilerplate to run the verification
def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        run_verification(page)
        browser.close()

if __name__ == "__main__":
    main()
