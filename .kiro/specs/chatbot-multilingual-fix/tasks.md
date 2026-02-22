# Implementation Plan

- [-] 1. Fix corrupted translation files and validate structure


  - Restore missing translation files for Marathi (mr) and Bengali (bn) from .bak files
  - Fix the corrupted mr/translation.json directory structure (currently a directory instead of file)
  - Validate all translation files have consistent keys with English version
  - _Requirements: 2.1, 2.3, 2.5_

- [ ] 1.1 Write property test for translation file validation
  - **Property 4: Translation key fallback behavior**
  - **Validates: Requirements 2.2**

- [ ] 2. Create centralized Language Manager utility
  - Implement LanguageManager class with consistent language detection
  - Add language change notification system
  - Integrate with existing i18n system (currently uses i18n.language directly)
  - _Requirements: 4.1, 4.2, 4.5_

- [ ] 2.1 Write property test for language detection consistency
  - **Property 8: Centralized language detection consistency**
  - **Validates: Requirements 4.1**

- [ ] 2.2 Write property test for language source priority
  - **Property 9: Language source priority enforcement**
  - **Validates: Requirements 4.2**

- [ ] 2.3 Write property test for language change notifications
  - **Property 10: Language change notification propagation**
  - **Validates: Requirements 4.5**

- [ ] 3. Enhance Voice Manager with language-aware voice selection
  - Refactor existing TTS Context to use centralized language detection
  - Improve voice selection logic (currently has basic language mapping)
  - Add voice toggle functionality with session persistence (currently missing toggle UI)
  - _Requirements: 1.3, 1.4, 3.1, 3.4_

- [ ] 3.1 Write property test for voice model selection
  - **Property 3: Voice model selection accuracy**
  - **Validates: Requirements 1.3**

- [ ] 3.2 Write property test for voice toggle consistency
  - **Property 5: Voice toggle state consistency**
  - **Validates: Requirements 3.1, 3.4**

- [ ] 3.3 Write property test for voice re-enabling
  - **Property 7: Voice re-enabling language consistency**
  - **Validates: Requirements 3.3**

- [ ] 4. Update Chatbot component for consistent multilingual responses
  - Integrate with Language Manager for consistent language detection (currently uses i18n.language directly)
  - Synchronize text and voice language for all responses (currently has separate language detection)
  - Add voice toggle UI control (currently missing from chatbot)
  - Handle language changes during conversations (currently resets conversation)
  - _Requirements: 1.1, 1.2, 1.5, 3.2_

- [ ] 4.1 Write property test for text-voice language consistency
  - **Property 1: Language consistency between text and voice**
  - **Validates: Requirements 1.2**

- [ ] 4.2 Write property test for language change synchronization
  - **Property 2: Language change synchronization**
  - **Validates: Requirements 1.1, 1.5**

- [ ] 4.3 Write property test for voice-disabled functionality
  - **Property 6: Voice-disabled text functionality**
  - **Validates: Requirements 3.2**

- [ ] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Add error handling and fallback mechanisms
  - Implement graceful fallbacks for missing voices (enhance existing fallback logic)
  - Add error handling for corrupted translation files
  - Add user notifications for voice synthesis failures (currently silent failures)
  - _Requirements: 1.4, 2.2, 3.5_

- [ ] 6.1 Write unit tests for error handling scenarios
  - Test missing voice fallback behavior
  - Test corrupted translation file handling
  - Test voice synthesis failure recovery
  - _Requirements: 1.4, 2.2, 3.5_

- [ ] 7. Final integration and testing
  - Test complete multilingual workflow end-to-end
  - Verify voice toggle works across all languages
  - Validate translation completeness across all supported languages
  - _Requirements: All requirements_

- [ ] 8. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.