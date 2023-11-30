import apiClient from "./services";

export default {
  getLanguages() {
    return apiClient.get("languages");
  },
  getLanguage(id) {
    return apiClient.get("languages/" + id);
  },
  addLanguage(language) {
    return apiClient.post("languages", language);
  },
  updateLanguage(language) {
    return apiClient.put("languages/" + language.id, language);
  },
  deleteLanguage(languageId) {
    return apiClient.delete("languages/" + languageId);
  },
};
