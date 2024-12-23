import React from "react";
import { Upload, message } from "antd";
import type { UploadProps } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import { useLanguage } from "../../contexts/LanguageContext";

interface FileUploaderProps {
  onUploadSuccess: (url: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadSuccess,
}) => {
  const { t } = useLanguage();

  const uploadProps: UploadProps = {
    name: "file",
    action: "/api/upload",
    accept: "image/*,.pdf,.doc,.docx",
    showUploadList: false,
    onChange(info) {
      if (info.file.status === "done") {
        onUploadSuccess(info.file.response.url);
        message.success(t("chat.uploadSuccess"));
      } else if (info.file.status === "error") {
        message.error(t("chat.uploadError"));
      }
    },
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error(t("chat.fileSizeLimit"));
        return false;
      }
      return true;
    },
  };

  return (
    <Upload {...uploadProps}>
      <PictureOutlined style={{ fontSize: "20px" }} />
    </Upload>
  );
};
