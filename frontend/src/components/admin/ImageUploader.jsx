import { useRef, useState } from "react";
import { Alert, Box, CircularProgress, IconButton, Stack, Typography } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";

import { uploadService } from "../../services/uploadService";
import { resolveImageUrl } from "../../services/api";

/**
 * Uploads land in backend/static/images/<categorySlug>/ so images stay
 * organized by category on disk. `multiple=false` behaves as a single
 * cover-image picker (used for category covers); `multiple=true` builds a
 * gallery array (used for product images).
 */
export default function ImageUploader({ images, onChange, categorySlug, multiple = true, label = "Images" }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const canUpload = Boolean(categorySlug) && !uploading;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const url = await uploadService.uploadImage(file, categorySlug);
      onChange(multiple ? [...images, url] : [url]);
    } catch {
      setError("Upload failed. Make sure it's an image (jpg/png/webp/gif) under 5MB.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (idx) => onChange(images.filter((_, i) => i !== idx));

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {label}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {error}
        </Alert>
      )}
      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
        {images.map((url, idx) => (
          <Box key={url} sx={{ position: "relative" }}>
            <Box
              component="img"
              src={resolveImageUrl(url)}
              alt=""
              sx={{
                width: 84,
                height: 84,
                objectFit: "cover",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            />
            <IconButton
              size="small"
              onClick={() => handleRemove(idx)}
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                width: 22,
                height: 22,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                "&:hover": { bgcolor: "error.main", color: "#fff" },
              }}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        ))}

        {(multiple || images.length === 0) && (
          <Box
            onClick={() => canUpload && fileInputRef.current?.click()}
            sx={{
              width: 84,
              height: 84,
              borderRadius: 2,
              border: "2px dashed",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: canUpload ? "pointer" : "not-allowed",
              opacity: categorySlug ? 1 : 0.5,
              color: "text.secondary",
            }}
          >
            {uploading ? <CircularProgress size={22} /> : <AddPhotoAlternateIcon />}
          </Box>
        )}
      </Stack>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        hidden
        onChange={handleFileChange}
      />

      {!categorySlug && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
          {multiple ? "Select a category first to upload images." : "Enter a slug first to upload an image."}
        </Typography>
      )}
    </Box>
  );
}
