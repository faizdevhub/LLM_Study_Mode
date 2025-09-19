import { StudySession } from '../types';

const STORAGE_KEY = 'gemini-study-sessions';

export class HistoryService {
  /**
   * Retrieves the study history from localStorage.
   * @returns An array of StudySession objects or an empty array if none found.
   */
  public static getHistory(): StudySession[] {
    try {
      const historyJson = localStorage.getItem(STORAGE_KEY);
      if (historyJson) {
        return JSON.parse(historyJson);
      }
    } catch (error) {
      console.error("Failed to parse study history from localStorage:", error);
    }
    return [];
  }

  /**
   * Saves the entire study history to localStorage.
   * @param sessions - The array of StudySession objects to save.
   */
  public static saveHistory(sessions: StudySession[]): void {
    try {
      const historyJson = JSON.stringify(sessions);
      localStorage.setItem(STORAGE_KEY, historyJson);
    } catch (error) {
      console.error("Failed to save study history to localStorage:", error);
    }
  }

  /**
   * Adds a new session or updates an existing one in the history.
   * @param history - The current history array.
   * @param session - The session to add or update.
   * @returns The new history array.
   */
  public static addOrUpdateSession(history: StudySession[], session: StudySession): StudySession[] {
    const existingIndex = history.findIndex(s => s.id === session.id);
    let newHistory: StudySession[];

    if (existingIndex > -1) {
      // Update existing session
      newHistory = [...history];
      newHistory[existingIndex] = session;
    } else {
      // Add new session
      newHistory = [...history, session];
    }
    
    this.saveHistory(newHistory);
    return newHistory;
  }
  
  /**
   * Clears all study sessions from localStorage.
   */
  public static clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error("Failed to clear study history from localStorage:", error);
    }
  }
}