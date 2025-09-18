import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const CustomButton = React.memo(
  ({
    children,
    onClick,
    type = 'button',
    disabled = false,
    className = '',
    variant = 'default',
    loading = false,
    ...props
  }) => {
    return (
      <Button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={className}
        variant={variant}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Button>
    );
  }
);

export default CustomButton;
