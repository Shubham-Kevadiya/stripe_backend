import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
        import: 'readonly',
        setTimeout: 'readonly',
      },
    },
    rules: {
      // rule reference :- https://eslint.org/docs/latest/rules/

      'no-undef': 'error', // give error if you use undefined variable
      semi: ['error', 'always'], // give error if semicolon is not added wherever it needed
      'no-var': 'error', // give error if you define variable using var
      'prefer-const': 'error', // it will update the keyword from var to const of variable automaticaly whenever eslint fic the code.
      'no-duplicate-imports': 'error', // it will give error if you import same file more than one time.
      'no-unused-vars': ['error', { argsIgnorePattern: 'req|res|next' }], // it will give error if you create a variable but not used it, you can configure to ignore some specific variable.
      'no-ex-assign': 'error', // it will disallow the reassignment of the exception variable in catch blocks.
      'no-fallthrough': 'error', // gives error when you forget to break switch case
      'prefer-template': 'error', // enforce to use ${} instead of concate the sring using +
      'no-unreachable': 'error', // give error if you have written code after return or break etc.
      'no-throw-literal': 'error', // Only throw Error objects
      'no-unmodified-loop-condition': 'error', // Prevent infinite loops
      'default-case': 'warn', // Require default case in switch statements
      'no-empty-function': 'error', // it will give error if you define an empty function.
      'no-extra-semi': 'error', // Disallows extra semicolons.
      'eol-last': 'error', // Enforces at least one newline at the end of non-empty files.
      'no-dupe-else-if': 'error', // Disallow duplicate conditions in if-else-if chains
      'no-duplicate-case': 'error', // Disallow duplicate case labels
      'no-import-assign': 'error', //Disallow assigning to imported bindings
      'no-template-curly-in-string': 'error', // Disallow template literal placeholder syntax in regular strings
      'no-useless-assignment': 'error', // Disallow variable assignments when the value is not used
      'use-isnan': 'error', // Require calls to isNaN() when checking for NaN
      'valid-typeof': 'error', // Enforce comparing typeof expressions against valid strings
      'block-scoped-var': 'error', // Enforce the use of variables within the scope they are defined
      'id-denylist': 'error', // Disallow specified identifiers
      'id-length': ['error', { min: 2, exceptions: ['i', 'j', 'k'] }], // Enforce minimum and maximum identifier lengths
      'id-match': ['error', '^[A-Za-z]+([A-Z][a-z]*)*$'], // Require identifiers to match a specified regular expression
      'no-empty': 'error', // Disallow empty block statements
      'no-redeclare': 'error', // Disallow variable redeclaration
      'no-shadow': 'error', // Disallow variable declarations from shadowing variables declared in the outer scope
      'no-unneeded-ternary': 'warn', // Disallow ternary operators when simpler alternatives exist
      'require-await': 'error', // Disallow async functions which have no await expression
      'for-direction': 'error', // prevent loop by throwing error from going to infinite loop

      // // "eqeqeq": "warn",  // it will force you to use === instead of == and !== instead of !=.
      // 'semi-spacing': 'error',  // give error if you add space before samicolon
      // 'no-magic-numbers': ['error', { ignore: [0, 100] }], // give error if you used numbers in code, you can add specific numbers which you want to ignore during checking
      // camelcase: ['error', { properties: 'always' }], // it will not allow to define variable names other than camelcase syntax.
      // 'space-before-function-paren': ['error', 'never'], // it will give error if you put space between functiona name and parentheses.
      // 'no-use-before-define': 'error', // it will not allow to use variable or function before it defines.
      // 'consistent-return': 'error', // if you add this rule in eslint then you have to either return something from every function or you don't have to return anything from all function.
      // 'no-underscore-dangle': 'error',  it will enforce you to use camelcase syntex while naming the variable.
    },
  },
]);
