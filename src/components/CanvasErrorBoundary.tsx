import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackGradient?: string;
}

interface State {
  hasError: boolean;
}

export class CanvasErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("3D Canvas WebGL context failed to render; falling back to 2D background:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className={`w-full h-full absolute inset-0 ${this.props.fallbackGradient || 'bg-gradient-to-b from-indigo-950 via-purple-900 to-pink-900'}`}
          aria-hidden="true"
        />
      );
    }
    return this.props.children;
  }
}
