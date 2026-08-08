import { api } from "./api";

export const uploadService = {
  uploadImage: (file, categorySlug) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category_slug", categorySlug);
    return api
      .post("/admin/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data.url);
  },
};
