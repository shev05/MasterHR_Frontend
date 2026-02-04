import { Component } from 'react';

import { Error } from '@/pages/error-page';

import type { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorText: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorText: '' };
  }

  resetError = () => {
    this.setState({ hasError: false, errorText: '' });
  };

  componentDidCatch(error: Error) {
    this.setState({
      hasError: true,
      errorText: error.message,
    });
  }

  render() {
    if (this.state.hasError) {
      return <Error errorMessage={this.state.errorText} onRetry={this.resetError} />;
    }
    return this.props.children;
  }
}
