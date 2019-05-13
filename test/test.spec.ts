import '@types/jest'; // because not getting any TypeScript errors, that TypeScript does not know jest, usually this should not be needed

describe('dummy test', () => {
   it('Has to be true', () => {
       expect(true).toBe(true);
   })
});