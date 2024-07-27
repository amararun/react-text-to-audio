import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Textarea } from "./components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert"
import { AlertCircle, Download } from 'lucide-react'

const TextToSpeechApp = () => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('alloy');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [error, setError] = useState('');

  const generateSpeech = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key.');
      return;
    }

    setIsLoading(true);
    setError('');
    setAudioUrl('');

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/audio/speech',
        {
          model: 'tts-1',
          input: text,
          voice: voice,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey.trim()}`,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        }
      );

      const blob = new Blob([response.data], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      setError('An error occurred while generating speech. Please check your API key and try again.');
      console.error('Error generating speech:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Text-to-Speech App</h1>
      
      <div className="space-y-2">
        <label htmlFor="api-key" className="text-sm font-medium">
          OpenAI API Key
        </label>
        <Input
          id="api-key"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your OpenAI API key"
        />
      </div>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to convert to speech..."
        className="min-h-[100px]"
      />

      <div className="flex gap-4">
        <Select value={voice} onValueChange={setVoice}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a voice" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alloy">Alloy</SelectItem>
            <SelectItem value="echo">Echo</SelectItem>
            <SelectItem value="fable">Fable</SelectItem>
            <SelectItem value="onyx">Onyx</SelectItem>
            <SelectItem value="nova">Nova</SelectItem>
            <SelectItem value="shimmer">Shimmer</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={generateSpeech} disabled={isLoading || !text.trim() || !apiKey.trim()}>
          {isLoading ? 'Generating...' : 'Generate Audio'}
        </Button>
      </div>

      {audioUrl && (
        <div className="space-y-2">
          <audio controls src={audioUrl} className="w-full" />
          <Button asChild className="w-full">
            <a href={audioUrl} download="generated_speech.mp3">
              <Download className="mr-2 h-4 w-4" /> Download Audio
            </a>
          </Button>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default TextToSpeechApp;