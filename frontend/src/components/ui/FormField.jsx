import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FormField = ({ id, label, type = 'text', value, onChange, ...props }) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};

export default FormField;
