import LoadingSpinner from './LoadingSpinner';

export default {
  title: 'UI/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'text',
      description: 'Size of the spinner (e.g., "24px", "40px")',
    },
    text: {
      control: 'text',
      description: 'Loading text to display',
    },
    showText: {
      control: 'boolean',
      description: 'Whether to show loading text',
    },
  },
};

export const Default = {
  args: {},
};

export const WithText = {
  args: {
    text: 'Loading...',
    showText: true,
  },
};

export const Small = {
  args: {
    size: '24px',
  },
};

export const Large = {
  args: {
    size: '60px',
  },
};

export const CustomText = {
  args: {
    text: 'Saving presentation...',
    showText: true,
    size: '32px',
  },
}; 