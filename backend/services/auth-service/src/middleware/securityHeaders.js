module.exports = (req, res, next) => {
  // Prevenir que el navegador detecte automáticamente MIME types
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Protección contra XSS en navegadores antiguos
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Controlar cómo se puede embeber el sitio en iframes
  res.setHeader('X-Frame-Options', 'DENY');
  
  // HTTP Strict Transport Security
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; object-src 'none'; img-src 'self' data:;"
  );
  
  next();
}; 