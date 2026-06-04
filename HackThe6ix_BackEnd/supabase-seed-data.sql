-- Create test organizations
INSERT INTO organizations (id, name) VALUES
    ('d0dc6b6c-7ea1-4df0-8595-7c773b86bd72', 'AI Research Lab'),
    ('e1ed7c7d-8fb2-4ef1-9696-8d884b86ce73', 'ML Testing Corp')
ON CONFLICT (id) DO NOTHING;

-- Seed public models
INSERT INTO public_models (name, huggingface_id, size_mb, parameter_count, vellum_deployment_id) VALUES
    ('GPT-2 Small', 'gpt2', 548, 124000000, 'vellum-gpt2-small'),
    ('BERT Base', 'bert-base-uncased', 440, 110000000, 'vellum-bert-base'),
    ('T5 Small', 't5-small', 950, 60000000, 'vellum-t5-small')
ON CONFLICT DO NOTHING;

-- Seed proprietary models
INSERT INTO proprietary_models (org_id, name, version, size_mb, file_path, vellum_deployment_id) VALUES
    ('d0dc6b6c-7ea1-4df0-8595-7c773b86bd72', 'CustomBERT v1', '1.0', 420, '/models/custom-bert-v1', 'vellum-custom-bert-1'),
    ('d0dc6b6c-7ea1-4df0-8595-7c773b86bd72', 'CustomGPT v2', '2.0', 680, '/models/custom-gpt-v2', 'vellum-custom-gpt-2'),
    ('e1ed7c7d-8fb2-4ef1-9696-8d884b86ce73', 'FastLLM', '1.1', 380, '/models/fast-llm', 'vellum-fast-llm')
ON CONFLICT DO NOTHING;

-- Seed comparison results with realistic benchmarking data
INSERT INTO comparison_results (
    org_id, test_name, comparison_type,
    model_a_id, model_a_type, model_b_id, model_b_type,
    avg_inference_ms_a, avg_inference_ms_b,
    model_size_mb_a, model_size_mb_b,
    peak_memory_mb_a, peak_memory_mb_b,
    fps_a, fps_b, winner
) VALUES
    -- BERT vs CustomBERT Comparison
    ('d0dc6b6c-7ea1-4df0-8595-7c773b86bd72', 
    'Text Classification Benchmark', 'Classification Performance',
    '2', 'public', '1', 'proprietary',
    45.2, 38.7, 440, 420, 1024, 980,
    22.1, 25.8, 'Model B (CustomBERT)'),

    -- GPT-2 vs CustomGPT Comparison
    ('d0dc6b6c-7ea1-4df0-8595-7c773b86bd72',
    'Text Generation Speed Test', 'Generation Performance',
    '1', 'public', '2', 'proprietary',
    82.4, 67.8, 548, 680, 1536, 1748,
    12.1, 14.7, 'Model B (CustomGPT)'),

    -- FastLLM vs T5 Comparison
    ('e1ed7c7d-8fb2-4ef1-9696-8d884b86ce73',
    'Translation Benchmark', 'Translation Quality',
    '3', 'public', '3', 'proprietary',
    55.6, 42.3, 950, 380, 2048, 1024,
    18.0, 23.6, 'Model B (FastLLM)');
