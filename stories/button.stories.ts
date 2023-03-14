import { ButtonComponent } from '@my/components/button';
import { Meta, StoryObj } from '@storybook/angular';

export default {
  title: 'Button',
  component: ButtonComponent,
} as Meta;

export const button: StoryObj<ButtonComponent> = (args: ButtonComponent) => ({
  props: args,
  template: `
    <button my-button>
      {{ label }}
    </button>
  `,
});
button.args = {
  label: 'Button',
};
