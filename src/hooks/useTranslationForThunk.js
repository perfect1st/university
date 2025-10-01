import { useTranslation } from "react-i18next";

export const useTranslationForThunk = () => {
  const { t } = useTranslation();
  return t;
};
