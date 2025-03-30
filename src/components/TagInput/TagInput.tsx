import React, { useRef, useState } from "react";
import styles from "./TagInput.module.css";

interface TagInputProps {
  label: string;
  tags: string[];
  setTags: (newTags: string[]) => void;
  placeholder?: string;
}

/**
 * TagInput: Muestra los chips y el campo de texto en la misma "caja".
 * Al presionar Enter, el texto se convierte en un chip. Se pueden eliminar chips con la X.
 */
export const TagInput: React.FC<TagInputProps> = ({
  label,
  tags,
  setTags,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      addTag(inputValue.trim());
      setInputValue("");
    }
  };

  const addTag = (value: string) => {
    setTags([...tags, value]);
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  // Al hacer clic en el contenedor, enfocamos el input
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={styles.tagInputWrapper}>
      <label className={styles.label}>{label}</label>
      <div className={styles.tagInputContainer} onClick={handleContainerClick}>
        {tags.map((tag, i) => (
          <div key={i} className={styles.chip}>
            <span>{tag}</span>
            <button type="button" onClick={() => removeTag(i)}>
              &times;
            </button>
          </div>
        ))}
        <input
          ref={inputRef}
          className={styles.tagInput}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};
