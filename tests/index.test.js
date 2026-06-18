const { add, greet } = require('../src/index');

test('add two numbers', () => {
  expect(add(2, 3)).toBe(5);
});

test('greet a person', () => {
  expect(greet('World')).toBe('Hello, World!');
});
