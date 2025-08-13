
export const bower = async() => {
  // Bower task is deprecated and does nothing now
  console.warn('The Bower task is deprecated and does nothing now. Please remove it from your configuration.');
  return Promise.resolve();
}
