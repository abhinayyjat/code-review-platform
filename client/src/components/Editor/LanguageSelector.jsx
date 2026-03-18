// client/src/components/Editor/LanguageSelector.jsx
const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python',     label: 'Python'     },
  { value: 'java',       label: 'Java'        },
  { value: 'cpp',        label: 'C++'         },
  { value: 'go',         label: 'Go'          },
  { value: 'rust',       label: 'Rust'        },
  { value: 'php',        label: 'PHP'         },
  { value: 'ruby',       label: 'Ruby'        },
  { value: 'csharp',     label: 'C#'          },
];

export default function LanguageSelector({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={function(e) { onChange(e.target.value); }}
      style={{ background:'#1a2540', color:'#e2e8f0', border:'1px solid #2d3748',
               borderRadius:6, padding:'8px 12px', fontSize:14, cursor:'pointer' }}
    >
      {LANGUAGES.map(function(lang) {
        return <option key={lang.value} value={lang.value}>{lang.label}</option>;
      })}
    </select>
  );
}
