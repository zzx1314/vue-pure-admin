export interface IDynamicFormItemSelectValueOption {
  text: string;
  value: string;
}

export interface SimpleSelectValueFormItemRef {
  setData(newData: IDynamicFormItemSelectValueOption[]): void;
}

export interface SimpleSelectValueFormItemProps {
  /**
   * 是否禁用
   */
  disabled: boolean;
  /**
   * 选择值
   */
  value: unknown;
}
