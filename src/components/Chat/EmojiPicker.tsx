import React from "react";
import { Popover, Button } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTheme } from "../../contexts/ThemeContext";

interface EmojiPickerProps {
  onSelect: (emoji: any) => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
  const { currentTheme } = useTheme();

  const content = (
    <Picker
      data={data}
      onEmojiSelect={onSelect}
      theme={currentTheme.type}
      set="apple"
      showPreview={false}
      showSkinTones={false}
      emojiSize={20}
      emojiButtonSize={28}
    />
  );

  return (
    <Popover
      content={content}
      trigger="click"
      placement="topLeft"
      overlayInnerStyle={{
        padding: 0,
        backgroundColor: currentTheme.colors.secondaryBackground,
      }}
    >
      <Button
        type="text"
        icon={<SmileOutlined style={{ fontSize: "20px" }} />}
      />
    </Popover>
  );
};
