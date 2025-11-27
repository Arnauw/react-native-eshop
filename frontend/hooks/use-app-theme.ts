import { useThemeStore } from "@/store/themeStore";
import { AppTheme } from "@/constants/theme";

export const useAppTheme = () => {
    const { isDarkMode, toggleTheme } = useThemeStore();
    
    const colors = isDarkMode ? AppTheme.dark : AppTheme.light;

    return { colors, isDarkMode, toggleTheme };
};