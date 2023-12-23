let nanoid;

(async () => {
  try {
    const module = await import('nanoid');
    nanoid = module.nanoid;
    
const channelID = nanoid(32);
console.log(channelID);

  } catch (error) {
    console.error('Failed to import nanoid:', error);
  }
})();

