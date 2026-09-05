---
name: kira-ai-api
description: Complete guide for integrating Kira AI API (OpenAI-compatible Chat, Image Generation, Video Generation, and TTS) into NodeJS, PHP, Python, and WordPress projects. Use this skill when writing code to invoke Kira AI APIs.
---

# 🤖 Kira AI API Integration Skill

This skill provides connection standards, payload structures, model lists, and optimized code patterns (NodeJS, PHP, Python, WordPress) to enable developers to easily integrate **Kira AI** services into any application.

---

## 🎯 When to Use This Skill

- When your project needs **Chat / Assistant** or **Automated Content Generation** capabilities.
- When your project needs **AI Image Generation** (Featured Images, Banners, Inline Content Images).
- When your project needs **Text-to-Video Short Generation**.
- When integrating Kira AI into content management platforms like **WordPress**, **Laravel**, or **NodeJS Apps**.

---

## 🔑 API Information & Authentication

- **Official Base URL**: `https://kiraai.vn` (or local proxy `http://127.0.0.1:4010/v1`)
- **Authentication Method**: Send API Key via the `Authorization` header as a Bearer token:
  ```http
  Authorization: Bearer YOUR_KIRA_API_KEY
  ```

### 📋 Supported Models List

| Model ID | Model Type | Key Features |
| :--- | :--- | :--- |
| **`kira-mini-1.0`** | Chat / Text | Free, versatile AI model suitable for daily conversations. No daily token cost. |
| **`kira-3.5-pro`** | Chat / Text | Fast response speed and deep code generation capabilities. |
| **`kira-3.5-flash`** | Chat / Text | Extremely versatile default model with lightning-fast response speed and high intelligence. |
| **`kira-2.5-pro`** | Chat / Text | Pro model line suitable for complex coding and text processing requirements. |
| **`kira-2.5-flash`** | Chat / Text | Long-term stable model line suitable for general information processing and voice generation. |
| **`kira-3.0-image`** | Image | High-speed, fast artistic image generation optimized for rapid ideation. |
| **`kira-2.0-image`** | Image | Stable artistic image generation for visual design tasks. |
| **`kira-3.0-video`** | Video | High-resolution realistic text-to-video motion synthesis. |
| **`kira-3.0-video-flash`** | Video | Advanced video model capable of 10s video generation and editing. |
| **`kira-3.0-flash-tts`** | Audio / TTS | Next-gen text-to-speech model with studio-grade natural intonation. |
| **`kira-2.0-flash-tts`** | Audio / TTS | Natural text-to-speech conversion optimized for speed. |

---

## 💻 Code Patterns & Examples

### 1. NodeJS / JavaScript (Fetch & EventSource)
Standard connection supporting both non-stream and streaming (Server-Sent Events) modes for real-time token rendering.

```javascript
/**
 * Call Kira AI Chat Completions API
 * 
 * @param {string} baseUrl     - Kira AI Server URL (e.g. 'https://kiraai.vn' or 'http://127.0.0.1:4010')
 * @param {string} apiKey      - Kira AI Developer API Key
 * @param {object} params      - Parameters: messages, model, stream, temperature, max_tokens
 */
async function callKiraAIChat(baseUrl, apiKey, {
  messages,
  model = 'kira-3.5-flash',
  stream = false,
  temperature = 0.7,
  max_tokens = 4096
}) {
  const endpoint = `${baseUrl}/api/v1/chat/completions`;
  const payload = {
    model,
    messages,
    stream,
    temperature,
    max_tokens
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `API Error Status: ${response.status}`);
  }

  // 1. Handle Stream response (Server-Sent Events)
  if (stream) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Keep unfinished line in buffer

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        
        const dataStr = trimmed.substring(6);
        if (dataStr === '[DONE]') continue;

        try {
          const parsed = JSON.parse(dataStr);
          const chunkText = parsed.choices?.[0]?.delta?.content;
          if (chunkText) {
            process.stdout.write(chunkText);
          }
        } catch (e) {
          // Ignore incomplete SSE chunk parse errors
        }
      }
    }
  } 
  // 2. Handle Non-stream response
  else {
    const data = await response.json();
    return data.choices[0].message.content;
  }
}
```

---

### 2. PHP / WordPress (Using `wp_remote_post`)
Perfect for WordPress plugins generating articles, headlines, or featured images.

```php
/**
 * Call Kira AI Chat API in WordPress
 *
 * @param string $prompt       User prompt sent to AI
 * @param string $api_key      Kira AI API Key
 * @param string $system_msg   System prompt directive
 * @param string $base_url     Base URL of Kira AI server
 * @return string|WP_Error     Response text or WP_Error object
 */
function wp_call_kira_ai_chat( $prompt, $api_key, $system_msg = 'You are an expert SEO article writer.', $base_url = 'https://kiraai.vn' ) {
    $endpoint = rtrim( $base_url, '/' ) . '/api/v1/chat/completions';
    
    $messages = [];
    if ( ! empty( $system_msg ) ) {
        $messages[] = [
            'role'    => 'system',
            'content' => $system_msg
        ];
    }
    $messages[] = [
        'role'    => 'user',
        'content' => $prompt
    ];

    $payload = [
        'model'       => 'kira-3.5-flash',
        'messages'    => $messages,
        'stream'      => false,
        'temperature' => 0.7
    ];

    $response = wp_remote_post( $endpoint, [
        'headers' => [
            'Content-Type'  => 'application/json',
            'Authorization' => 'Bearer ' . $api_key
        ],
        'body'    => wp_json_encode( $payload ),
        'timeout' => 90
    ] );

    if ( is_wp_error( $response ) ) {
        return $response;
    }

    $body = wp_remote_retrieve_body( $response );
    $data = json_decode( $body, true );

    if ( isset( $data['error'] ) ) {
        return new WP_Error( 'kira_ai_error', $data['error']['message'] ?? 'Unknown error from Kira AI.' );
    }

    return $data['choices'][0]['message']['content'] ?? '';
}
```

---

### 3. Python (Requests & Image / Video Generation)
Ideal for automation scripts, batch processing, and AI agents.

```python
import requests
import time

class KiraAIClient:
    def __init__(self, api_key, base_url="https://kiraai.vn"):
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

    def generate_image(self, prompt, aspect_ratio="16:9", model="kira-3.0-image"):
        """
        Generate image from prompt via Kira AI.
        Returns Base64 image data and MimeType.
        """
        url = f"{self.base_url}/api/v1/images/generations"
        payload = {
            "prompt": prompt,
            "model": model,
            "aspect_ratio": aspect_ratio
        }
        
        response = requests.post(url, json=payload, headers=self.headers, timeout=60)
        response.raise_for_status()
        data = response.json()
        
        image_info = data.get("data", [])[0]
        return image_info["b64_json"], image_info["mime_type"]

    def generate_video_sync(self, prompt, aspect_ratio="16:9", duration_seconds=6, model="kira-3.0-video"):
        """
        Generate text-to-video. Video generation is async, so this function polls until completion.
        """
        init_url = f"{self.base_url}/api/v1/videos/generations"
        payload = {
            "prompt": prompt,
            "aspect_ratio": aspect_ratio,
            "duration_seconds": duration_seconds,
            "model": model
        }
        
        res = requests.post(init_url, json=payload, headers=self.headers, timeout=30)
        res.raise_for_status()
        operation = res.json()
        
        op_id = operation["id"]
        print(f"Video generation task started. Operation ID: {op_id}. Processing...")
        
        status_url = f"{self.base_url}/api/v1/videos/operations/{op_id}"
        while True:
            time.sleep(10)
            check_res = requests.get(status_url, headers=self.headers, timeout=20)
            check_res.raise_for_status()
            status_data = check_res.json()
            
            if status_data.get("status") == "completed":
                print("Video generated successfully!")
                video_info = status_data.get("data", [])[0]
                return video_info["b64_json"], video_info["mime_type"]
            elif status_data.get("status") == "failed":
                raise Exception(f"Video generation failed: {status_data.get('error')}")
            else:
                print("Processing video...")
```

---

### 4. Multimodal Requests (Image Analysis)

Text generation models like `kira-3.5-flash` support image analysis (Multimodal). You can send image analysis requests using either format below:

#### Option 1: OpenAI Multimodal Standard (Recommended)
Pass `content` as an array of text and `image_url` containing Base64 Data URIs:

```javascript
const response = await fetch('https://kiraai.vn/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_KIRA_API_KEY'
  },
  body: JSON.stringify({
    model: 'kira-3.5-flash',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Please describe this image in detail.'
          },
          {
            type: 'image_url',
            image_url: {
              url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQE...'
            }
          }
        ]
      }
    ]
  })
});
const data = await response.json();
console.log(data.choices[0].message.content);
```

#### Option 2: Gemini-native Parts
Kira AI also supports Gemini native `parts` and `inlineData` directly inside `messages`:

```json
{
  "model": "kira-3.5-flash",
  "messages": [
    {
      "role": "user",
      "parts": [
        {
          "text": "Please describe this image..."
        },
        {
          "inlineData": {
            "mimeType": "image/jpeg",
            "data": "/9j/4AAQSkZJRgABAQE..."
          }
        }
      ]
    }
  ]
}
```

---

### 5. Text to Speech API (TTS)

Kira AI Text-to-Speech API is fully OpenAI-compatible at endpoint `/api/v1/audio/speech`.

#### Parameters:
- **Model**: `kira-3.0-flash-tts` or `kira-2.0-flash-tts`
- **Voice**: `alloy` (Kore), `echo` (Fenrir), `fable` (Puck), `onyx` (Charon), `nova` (Aoede)
- **Input**: The text string to synthesize into speech.

#### NodeJS / JavaScript Example:
```javascript
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://kiraai.vn/api/v1",
  apiKey: "YOUR_KIRA_API_KEY"
});

const mp3 = await openai.audio.speech.create({
  model: "kira-3.0-flash-tts",
  voice: "alloy",
  input: "Welcome to the Kira AI ecosystem."
});

const buffer = Buffer.from(await mp3.arrayBuffer());
await fs.promises.writeFile("output.mp3", buffer);
```

#### Python Example:
```python
import requests

url = "https://kiraai.vn/api/v1/audio/speech"
headers = {
    "Authorization": "Bearer YOUR_KIRA_API_KEY",
    "Content-Type": "application/json"
}
payload = {
    "model": "kira-3.0-flash-tts",
    "input": "Welcome to the Kira AI ecosystem.",
    "voice": "alloy"
}

response = requests.post(url, json=payload, headers=headers)
with open("output.mp3", "wb") as f:
    f.write(response.content)
```

---

### 6. Models List API

Query active models, capabilities, and pricing information on the Kira AI network.

* **Endpoint:** `GET /api/v1/models`
* **Auth:** Optional / `Authorization: Bearer YOUR_KIRA_API_KEY`
* **Response Example:**
  ```json
  {
    "object": "list",
    "data": [
      {
        "id": "kira-3.5-flash",
        "object": "model",
        "created": 1782806352,
        "owned_by": "kira-ai",
        "type": "chat",
        "is_free": false,
        "name": "Kira 3.5 Pro",
        "description": "Fastest model with superior SEO generation.",
        "status": "active"
      }
    ]
  }
  ```

---

### 7. TTS Voices List API

Query available voice options, gender, and language mapping for Text-to-Speech models.

* **Endpoint:** `GET /api/v1/audio/voices`
* **Auth:** Optional (Public endpoint)
* **Response Example:**
  ```json
  {
    "object": "list",
    "data": [
      {
        "id": "alloy",
        "name": "Alloy",
        "mapped_to": "Kore",
        "gender": "Female",
        "description": "Natural, clear female voice.",
        "language": "en-US / vi-VN"
      },
      {
        "id": "echo",
        "name": "Echo",
        "mapped_to": "Fenrir",
        "gender": "Male",
        "description": "Warm, deep male voice.",
        "language": "en-US / vi-VN"
      }
    ]
  }
  ```

---

## 🔒 Golden Rules for Developers

1. **🔒 Never Expose API Keys on Client-side:**
   Never store API Keys or make direct requests from front-end applications (React, Vue, plain HTML/JS). Always route requests through a backend server or local proxy (KiraAI Route).

2. **⚡ Use Streaming for Long Responses:**
   Enable `stream: true` to receive realtime token streams for long code generation and article writing.

3. **🖼️ Base64 Image Processing:**
   Image generation returns Base64 data (`b64_json`). Convert Base64 strings to binary image files when storing in databases or CMS upload folders (like WordPress `wp_insert_attachment`).

4. **⌛ Configure Proper HTTP Timeout:**
   Set HTTP client timeouts to at least **60s to 90s** for image, video, or deep code generation tasks.
