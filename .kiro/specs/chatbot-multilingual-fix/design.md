# Design Document

## Overview

This design addresses the multilingual chatbot issues by implementing a centralized language management system, fixing corrupted translation files, and providing consistent voice-text language synchronization with an option to disable voice output.

## Architecture

The solution follows a centralized language management approach:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   i18n System   │────│ Language Manager │────│  Voice Manager  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ├── Chatbot Component
                              ├── TTS Context
                              └── Translation Validation
```

## Components and Interfaces

### Language Manager
- **Purpose**: Centralized language detection and management
- **Interface**: `getCurrentLanguage(): string`, `onLanguageChange(callback: Function)`
- **Responsibilities**: Single source of truth for current language, notification system for language changes

### Voice Manager
- **Purpose**: Manages voice synthesis with language-aware voice selection
- **Interface**: `speak(text: string, language?: string)`, `toggleVoice()`, `isVoiceEnabled(): boolean`
- **Responsibilities**: Voice synthesis, voice model selection, voice state management

### Translation Validator
- **Purpose**: Validates and repairs translation files
- **Interface**: `validateTranslations()`, `repairMissingFiles()`
- **Responsibilities**: File integrity checking, missing key detection, backup restoration

### Enhanced Chatbot Component
- **Purpose**: Provides consistent multilingual text and voice responses
- **Interface**: Standard React component with language-aware messaging
- **Responsibilities**: Message handling, language-synchronized responses, voice toggle UI

## Data Models

### Language Configuration
```typescript
interface LanguageConfig {
  code: string;           // 'hi', 'en', 'mr', 'bn'
  name: string;           // Display name
  speechCode: string;     // 'hi-IN', 'en-IN'
  voiceNames: string[];   // Preferred voice names
  fallbackVoice?: string; // Fallback voice
}
```

### Voice State
```typescript
interface VoiceState {
  enabled: boolean;
  currentLanguage: string;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoice?: SpeechSynthesisVoice;
}
```

### Translation Validation Result
```typescript
interface ValidationResult {
  isValid: boolean;
  missingKeys: string[];
  corruptedFiles: string[];
  repairedFiles: string[];
}
```

## Correctness
 Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Property 1: Language consistency between text and voice
*For any* chatbot response, the language used for text display should match the language used for voice synthesis
**Validates: Requirements 1.2**

Property 2: Language change synchronization
*For any* language change event, both text responses and voice output should update to match the new selected language
**Validates: Requirements 1.1, 1.5**

Property 3: Voice model selection accuracy
*For any* supported language, when voice synthesis is active, the system should select a voice model that matches the current language
**Validates: Requirements 1.3**

Property 4: Translation key fallback behavior
*For any* missing translation key, the system should fall back to English and maintain functionality
**Validates: Requirements 2.2**

Property 5: Voice toggle state consistency
*For any* voice toggle action, the system should immediately reflect the new state and maintain it throughout the session
**Validates: Requirements 3.1, 3.4**

Property 6: Voice-disabled text functionality
*For any* chatbot interaction when voice is disabled, text responses should continue working normally without audio output
**Validates: Requirements 3.2**

Property 7: Voice re-enabling language consistency
*For any* voice re-enabling action, the system should resume speaking in the current interface language
**Validates: Requirements 3.3**

Property 8: Centralized language detection consistency
*For any* component requesting current language, the centralized language detection should return the same result
**Validates: Requirements 4.1**

Property 9: Language source priority enforcement
*For any* scenario with multiple language sources, the system should prioritize i18n.language over other sources
**Validates: Requirements 4.2**

Property 10: Language change notification propagation
*For any* language change event, all registered components should receive notifications through the consistent mechanism
**Validates: Requirements 4.5**

## Error Handling

### Translation File Errors
- **Missing Files**: Automatic detection and restoration from backup or regeneration
- **Corrupted JSON**: Validation on load with fallback to English and error logging
- **Missing Keys**: Runtime fallback to English with console warnings for developers

### Voice Synthesis Errors
- **No Available Voices**: Graceful fallback to English voice with user notification
- **Synthesis Failure**: Automatic voice disabling with error message display
- **Language Mismatch**: Fallback voice selection with preference logging

### Language Detection Errors
- **Invalid Language Code**: Default to English with error logging
- **Multiple Source Conflicts**: Clear priority order (i18n > browser > default)
- **Detection Failure**: Fallback to English with system notification

## Testing Strategy

### Unit Testing Approach
- Test individual components (Language Manager, Voice Manager, Translation Validator)
- Test specific error scenarios (missing files, corrupted data, synthesis failures)
- Test UI interactions (voice toggle, language switching)
- Test integration points between components

### Property-Based Testing Approach
- Use **fast-check** library for TypeScript property-based testing
- Configure each property test to run minimum 100 iterations
- Generate random language codes, text content, and user interactions
- Test universal properties across all supported languages and scenarios
- Each property test will be tagged with format: **Feature: chatbot-multilingual-fix, Property {number}: {property_text}**

**Property-based testing requirements**:
- All correctness properties must be implemented as property-based tests
- Tests should generate diverse inputs (languages, text content, user actions)
- Each test should verify the property holds across all generated scenarios
- Tests should include edge cases through smart generators (missing voices, corrupted files)
- Minimum 100 iterations per property test to ensure thorough coverage