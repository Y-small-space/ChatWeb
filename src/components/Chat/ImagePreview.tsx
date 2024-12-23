import React from "react";
import { Modal } from "antd";
import { useTheme } from "../../contexts/ThemeContext";

interface ImagePreviewProps {
  url: string;
  visible: boolean;
  onClose: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  url,
  visible,
  onClose,
}) => {
  const { currentTheme } = useTheme();

  return (
    <Modal
      open={visible}
      footer={null}
      onCancel={onClose}
      width="auto"
      centered
      styles={{
        mask: {
          backgroundColor: "rgba(0, 0, 0, 0.85)",
        },
        content: {
          backgroundColor: "transparent",
          boxShadow: "none",
          padding: 0,
          maxWidth: "90vw",
          maxHeight: "90vh",
        },
      }}
    >
      <img
        src={url}
        alt="预览图片"
        style={{
          maxWidth: "100%",
          maxHeight: "90vh",
          objectFit: "contain",
        }}
      />
    </Modal>
  );
};
