const CircuitBreaker = require('opossum');

const defaultOptions = {
  timeout: 5000,               // Si la función tarda más de 5 segundos, se considera fallida
  errorThresholdPercentage: 50, // Cuando el 50% de las solicitudes fallan, el breaker se abre
  resetTimeout: 30000           // Después de 30 segundos, el breaker intenta cerrarse
};

const createCircuitBreaker = (fn, options = {}) => {
  const circuitBreakerOptions = {
    ...defaultOptions,
    ...options
  };
  
  const breaker = new CircuitBreaker(fn, circuitBreakerOptions);
  
  // Eventos para logging
  breaker.on('open', () => {
    console.log(`CIRCUIT BREAKER: Circuito abierto para ${fn.name}`);
  });
  
  breaker.on('close', () => {
    console.log(`CIRCUIT BREAKER: Circuito cerrado para ${fn.name}`);
  });
  
  breaker.on('halfOpen', () => {
    console.log(`CIRCUIT BREAKER: Circuito semi-abierto para ${fn.name}`);
  });
  
  breaker.on('fallback', (result) => {
    console.log(`CIRCUIT BREAKER: Ejecutando fallback para ${fn.name}`);
  });
  
  return breaker;
};

module.exports = createCircuitBreaker; 