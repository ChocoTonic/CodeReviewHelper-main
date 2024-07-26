import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select.tsx";

export type SelectInputItem = {
  value: string;
  label: string;
}

export type SelectInputProps = {
  items?: SelectInputItem[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const SelectInput: React.FC<SelectInputProps> = (props) => {
  return (
    <Select value={props.value} onValueChange={(value) => {
        props.onChange?.(value);
    }}>
      <SelectTrigger className={props.className}>
        <SelectValue placeholder={props.placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {props.items?.map((item) => (
            <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default SelectInput;
