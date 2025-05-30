import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "my-button-showcase",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="button-showcase">
      <h1>Button Showcase</h1>
      <div class="button-grid">
        @for (button of buttons; track button.type) {
          <div class="button-item">
            <button [class]="'glass-button ' + button.type">
              {{ button.text }}
            </button>
            <p class="button-label">{{ button.type | titlecase }}</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .button-showcase {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

      h1 {
        color: #2d3748;
        font-size: 2rem;
        margin-bottom: 2rem;
        text-align: center;
      }
    }

    .button-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      padding: 1rem;
    }

    .button-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 12px;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-2px);
      }
    }

    .button-label {
      color: #4a5568;
      font-size: 0.875rem;
      text-transform: capitalize;
      font-weight: 500;
    }
  `,
})
export class ButtonShowcaseComponent {
  buttons = [
    { text: "Primary Button", type: "primary" },
    { text: "Secondary Button", type: "secondary" },
    { text: "Success Button", type: "success" },
    { text: "Danger Button", type: "danger" },
  ];
}
