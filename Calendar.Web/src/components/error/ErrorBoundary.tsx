import React, { Component, ErrorInfo, ReactNode } from 'react';
import ErrorContent from './ErrorContent';

type ErrorBoundaryProps = {
    children: React.ReactNode
}

type ErrorBoundaryState = {
    hasError: boolean,
    errorMessage: string | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor (props: ErrorBoundaryProps){
        super(props);
        this.state = { hasError: false, errorMessage: null};
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        this.setState({ hasError: true, errorMessage: error.message });
    }

    render() {
        if (this.state.hasError) {
          return <ErrorContent />;
        }
    
        return this.props.children;
      }
}

export default ErrorBoundary;