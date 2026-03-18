import { useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';

const DEFAULT_CODE = {
  javascript: '// Paste your JavaScript code here\nfunction greet(name) {\n  console.log("Hello " + name);\n}',
typescript: '// Paste your TypeScript code here\nfunction greet(name: string): void {\n  console.log(`Hello ${name}`);\n}',
  python:     '# Paste your Python code here\ndef greet(name):\n    print(f"Hello {name}")',
  java:       '// Paste your Java code here\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello");\n  }\n}',
  cpp:        '// Paste your C++ code here\n#include <iostream>\nint main() {\n  std::cout << "Hello" << std::endl;\n  return 0;\n}',
  go:         '// Paste your Go code here\npackage main\nimport "fmt"\nfunc main() {\n  fmt.Println("Hello")\n}',
};

export default function CodeEditor({ language, value, onChange }) {
  var editorRef = useRef(null);

  function handleMount(editor) {
    editorRef.current = editor;
    editor.focus();
  }

  return (
    <div style={{ border: '1px solid #1e2535', borderRadius: 8, overflow: 'hidden' }}>
      <MonacoEditor
        height='450px'
        language={language}
        value={value || DEFAULT_CODE[language] || ''}
        theme='vs-dark'
        onChange={onChange}
        onMount={handleMount}
        options={{
          fontSize:          14,
          minimap:           { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap:          'on',
          automaticLayout:   true,
          tabSize:           2,
          renderLineHighlight: 'all',
          padding:           { top: 16 },
        }}
      />
    </div>
  );
}
