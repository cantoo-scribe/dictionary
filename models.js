/**
 * MIT License
 *
 * Copyright (c) 2025 Cantoo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// @ts-check
module.exports = {
  models: {
    // https://huggingface.co/hugging-quants/Llama-3.2-1B-Instruct-Q4_K_M-GGUF/tree/main
    llama: {
      repo: 'hugging-quants/Llama-3.2-1B-Instruct-Q4_K_M-GGUF',
      file: 'llama-3.2-1b-instruct-q4_k_m.gguf',
    },
    // https://huggingface.co/medmekk/Qwen2.5-0.5B-Instruct.GGUF/tree/main
    qwen: {
      repo: 'medmekk/Qwen2.5-0.5B-Instruct.GGUF',
      file:'Qwen2.5-0.5B-Instruct-Q5_K_S.gguf'
    },
    // https://huggingface.co/medmekk/Qwen2.5-1.5B-Instruct.GGUF/tree/main
    qwen1_5B: {
      repo: 'medmekk/Qwen2.5-1.5B-Instruct.GGUF',
      file:'Qwen2.5-1.5B-Instruct-Q8_0.gguf'
    },
    // https://huggingface.co/unsloth/DeepSeek-R1-Distill-Qwen-1.5B-GGUF/tree/main
    deepSeek: {
      repo: 'unsloth/DeepSeek-R1-Distill-Qwen-1.5B-GGUF',
      file:'DeepSeek-R1-Distill-Qwen-1.5B-Q5_K_M.gguf'
    },
    // https://huggingface.co/bartowski/SmolLM2-1.7B-Instruct-GGUF/tree/main
    smool: {
      repo: 'bartowski/SmolLM2-1.7B-Instruct-GGUF',
      file: 'SmolLM2-1.7B-Instruct-Q5_K_M.gguf'
    },
    // https://huggingface.co/TheBloke/Mistral-7B-v0.1-GGUF/tree/main
    mistral: {
      repo: 'TheBloke/Mistral-7B-v0.1-GGUF',
      file: 'mistral-7b-v0.1.Q5_K_M.gguf'
    },
    // https://huggingface.co/DavidAU/French-Alpaca-Croissant-1.3B-Instruct-Q6_K-GGUF/tree/main
    croissant: {
      repo: 'DavidAU/French-Alpaca-Croissant-1.3B-Instruct-Q6_K-GGUF',
      file: 'french-alpaca-croissant-1.3b-instruct.Q6_K.gguf'
    }
  }
}
