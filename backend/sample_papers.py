"""
DocuMind Scholar - Pre-loaded Benchmark Data
Cleanly decoupled into:
1. STUDENT_MATERIALS: Textbooks, lecture notes, study guides, and assignment solutions.
2. RESEARCH_PAPERS: Peer-reviewed research papers, conference preprints, and benchmark literature.
"""

from typing import Dict, List, Any

# ==============================================================================
# 1. STUDENT COURSE MATERIALS & TEXTBOOKS (domain="student")
# ==============================================================================

STUDENT_MATERIALS: Dict[str, Dict[str, Any]] = {
    "cs229-machine-learning-notes": {
        "id": "cs229-machine-learning-notes",
        "domain": "student",
        "filename": "CS229_Machine_Learning_Lecture_Notes.pdf",
        "file_type": "pdf",
        "title": "CS229: Machine Learning & Neural Networks Lecture Notes",
        "authors": ["Stanford CS Department (Prof. Andrew Ng)"],
        "year": "2024",
        "total_pages": 12,
        "summary_cards": {
            "problem_statement": "Understanding how machines learn from empirical data without being explicitly programmed for every single edge case.",
            "core_architecture": "Supervised learning pipeline covering Linear & Logistic Regression, Neural Networks with Backpropagation, and Regularization techniques (L1/L2 and Dropout).",
            "datasets_and_metrics": "Key concepts: Mean Squared Error (MSE), Cross-Entropy Loss, Gradient Descent convergence rates, and Precision/Recall trade-offs.",
            "critical_limitations": "Watch out in exams for Overfitting vs Underfitting, Vanishing Gradients in deep sigmoid networks, and improper feature normalization."
        },
        "sections": {
            "overview": {
                "section_name": "overview",
                "title": "Course Overview & Learning Objectives",
                "text": "Welcome to CS229 Machine Learning. In this course, you will master the core foundations of supervised learning, unsupervised learning, and deep neural representations.\n\nKey exam concepts include cost function optimization, gradient descent, bias-variance tradeoff, and multi-layer perceptron backpropagation.",
                "pages": [1],
                "block_count": 2
            },
            "linear_regression": {
                "section_name": "linear_regression",
                "title": "Linear Regression & Gradient Descent",
                "text": "Linear regression fits a linear hypothesis $h_\\theta(x) = \\theta^T x$ to continuous targets.\n\nThe Mean Squared Error Cost Function is given by:\n$$J(\\theta) = \\frac{1}{2m} \\sum_{i=1}^{m} (h_\\theta(x^{(i)}) - y^{(i)})^2$$\n\nBatch Gradient Descent updates parameters simultaneously:\n$$\\theta_j := \\theta_j - \\alpha \\frac{\\partial J(\\theta)}{\\partial \\theta_j} = \\theta_j - \\alpha \\frac{1}{m} \\sum_{i=1}^{m} (h_\\theta(x^{(i)}) - y^{(i)}) x_j^{(i)}$$\nwhere $\\alpha$ is the learning rate.",
                "pages": [2, 3],
                "block_count": 5
            },
            "neural_networks": {
                "section_name": "neural_networks",
                "title": "Neural Networks & Backpropagation",
                "text": "Neural networks compose linear matrix transformations with non-linear activation functions (ReLU, Sigmoid, GELU).\n\nForward propagation passes layer activations $a^{[l]} = g(W^{[l]} a^{[l-1]} + b^{[l]})$.\nBackpropagation applies the multivariable chain rule to compute partial derivatives $\\frac{\\partial \\mathcal{L}}{\\partial W^{[l]}}$, enabling efficient weight updates using stochastic gradient descent (SGD) or Adam.",
                "pages": [4, 5, 6],
                "block_count": 6
            },
            "regularization": {
                "section_name": "regularization",
                "title": "Overfitting, Bias-Variance & Regularization",
                "text": "Overfitting (high variance) occurs when a model learns training noise and fails to generalize to unseen test data.\n\nTechniques to combat overfitting:\n1. L2 Regularization (Weight Decay): Adds $\\frac{\\lambda}{2m} \\sum w^2$ to the loss function.\n2. Dropout: Randomly drops units with probability $p$ during training.\n3. Early Stopping: Halts training when validation loss begins to rise.",
                "pages": [7, 8],
                "block_count": 4
            },
            "exam_prep": {
                "section_name": "exam_prep",
                "title": "Final Exam Revision & Practice Problems",
                "text": "High-Yield Exam Tips:\n1. What happens if the learning rate $\\alpha$ is too large? Gradient descent will oscillate or diverge.\n2. Why use ReLU instead of Sigmoid in deep hidden layers? ReLU avoids vanishing gradients for positive inputs because its derivative is 1.",
                "pages": [9, 10],
                "block_count": 3
            }
        },
        "equations": [
            {
                "id": "eq-mse",
                "page": 2,
                "raw_text": "J(theta) = 1/(2m) sum (h(x) - y)^2",
                "latex": r"J(\theta) = \frac{1}{2m} \sum_{i=1}^{m} \left(h_\theta(x^{(i)}) - y^{(i)}\right)^2",
                "description": "Mean Squared Error (MSE) cost function measuring average squared error between predictions and ground-truth values."
            },
            {
                "id": "eq-gd",
                "page": 3,
                "raw_text": "theta_j := theta_j - alpha * (1/m) sum (h(x) - y) * x_j",
                "latex": r"\theta_j := \theta_j - \alpha \frac{1}{m} \sum_{i=1}^{m} \left(h_\theta(x^{(i)}) - y^{(i)}\right) x_j^{(i)}",
                "description": "Gradient Descent parameter update rule for linear regression."
            },
            {
                "id": "eq-relu",
                "page": 5,
                "raw_text": "ReLU(z) = max(0, z)",
                "latex": r"\text{ReLU}(z) = \max(0, z), \quad \frac{d}{dz}\text{ReLU}(z) = \begin{cases} 1 & z > 0 \\ 0 & z < 0 \end{cases}",
                "description": "Rectified Linear Unit (ReLU) activation function preventing vanishing gradients in deep architectures."
            }
        ],
        "metrics": [
            {"name": "Accuracy Benchmark", "value": "98.5%", "page": 8, "context": "Test accuracy on MNIST digits."},
            {"name": "Convergence Speed", "value": "20 Epochs", "page": 4, "context": "Standard convergence on CIFAR-10."}
        ],
        "flashcards": [
            {
                "id": "fc-s1",
                "category": "Optimization",
                "question": "What happens during gradient descent if the learning rate $\\alpha$ is set too high?",
                "answer": "If $\\alpha$ is too high, gradient descent will overshoot the minimum, causing the cost function $J(\\theta)$ to oscillate wildly or diverge entirely.",
                "difficulty": "Good",
                "tags": ["Optimization", "Gradient Descent", "Exam High-Yield"]
            },
            {
                "id": "fc-s2",
                "category": "Neural Networks",
                "question": "Why does the Sigmoid activation function cause the Vanishing Gradient problem in deep networks?",
                "answer": "The maximum derivative of the Sigmoid function is only $0.25$. Multiplying multiple values less than $0.25$ through chain-rule backpropagation causes gradients in earlier layers to approach zero.",
                "difficulty": "Hard",
                "tags": ["Neural Networks", "Activations", "Backprop"]
            },
            {
                "id": "fc-s3",
                "category": "Regularization",
                "question": "How does Dropout prevent neural network overfitting during training?",
                "answer": "Dropout randomly deactivates a fraction $p$ of neurons on each training step, preventing co-adaptation of features and acting as an ensemble of smaller subnetworks.",
                "difficulty": "Easy",
                "tags": ["Regularization", "Overfitting"]
            }
        ],
        "concept_flow": {
            "title": "Machine Learning Training Pipeline",
            "description": "Step-by-step lifecycle from data preparation to gradient descent parameter updates.",
            "steps": [
                {
                    "step": 1,
                    "name": "Dataset Preprocessing & Normalization",
                    "description": "Features $X$ are standardized to zero mean and unit variance ($Z = \\frac{X - \\mu}{\\sigma}$).",
                    "formula": "x_{\\text{norm}} = \\frac{x - \\mu}{\\sigma}",
                    "badge": "Data Prep"
                },
                {
                    "step": 2,
                    "name": "Forward Hypothesis Computation",
                    "description": "Input features are passed through linear layers and non-linear activations to produce predictions $\\hat{y}$.",
                    "formula": "\\hat{y} = g(W x + b)",
                    "badge": "Forward Pass"
                },
                {
                    "step": 3,
                    "name": "Cost Function Evaluation",
                    "description": "Prediction error is quantified using loss functions such as Cross-Entropy or Mean Squared Error.",
                    "formula": "J(\\theta) = -\\frac{1}{m} \\sum [y \\log \\hat{y} + (1-y) \\log(1-\\hat{y})]",
                    "badge": "Loss Check"
                },
                {
                    "step": 4,
                    "name": "Backpropagation & Gradient Descent",
                    "description": "Chain rule computes parameter gradients and updates weights to minimize loss.",
                    "formula": "W := W - \\alpha \\frac{\\partial J}{\\partial W}",
                    "badge": "Weight Update"
                }
            ]
        },
        "quiz": [
            {
                "id": "q-s1",
                "question": "Which of the following techniques is specifically designed to reduce high variance (overfitting) in deep neural networks?",
                "options": [
                    "Increasing model capacity and layer count",
                    "Applying Dropout and L2 Regularization (Weight Decay)",
                    "Removing all validation sets",
                    "Decreasing the dataset size"
                ],
                "correct_index": 1,
                "rationale": "Dropout and L2 regularization penalize excessively large weights and feature co-adaptation, directly reducing overfitting and improving test generalization."
            },
            {
                "id": "q-s2",
                "question": "What is the derivative of the ReLU activation function $f(z) = \\max(0, z)$ for $z > 0$?",
                "options": [
                    "0",
                    "1",
                    "$z$",
                    "$\\frac{1}{1 + e^{-z}}$"
                ],
                "correct_index": 1,
                "rationale": "For any positive input $z > 0$, the slope of ReLU is constant and equal to 1, which prevents the vanishing gradient problem in backpropagation."
            }
        ]
    },

    "math101-linear-algebra-calculus": {
        "id": "math101-linear-algebra-calculus",
        "domain": "student",
        "filename": "MATH101_Linear_Algebra_and_Calculus_Textbook.pdf",
        "file_type": "pdf",
        "title": "MATH101: Linear Algebra & Matrix Calculus Study Guide",
        "authors": ["Department of Mathematics & Applied Sciences"],
        "year": "2024",
        "total_pages": 14,
        "summary_cards": {
            "problem_statement": "Mastering multidimensional vector transformations, eigenvalues, matrix decompositions, and multivariable optimization.",
            "core_architecture": "Vector spaces, dot and cross products, matrix rank, determinants, eigenvalue-eigenvector pairs ($A v = \\lambda v$), SVD decomposition, and gradient vectors $\\nabla f$.",
            "datasets_and_metrics": "Core identities: $\\det(AB) = \\det(A)\\det(B)$, $(AB)^T = B^T A^T$, and Singular Value Decomposition $A = U \\Sigma V^T$.",
            "critical_limitations": "Common exam mistakes: Confusing matrix multiplication non-commutativity ($AB \\neq BA$) and invertibility criteria (invertible iff $\\det(A) \\neq 0$)."
        },
        "sections": {
            "vectors_matrices": {
                "section_name": "vectors_matrices",
                "title": "Vector Spaces, Dot Products & Matrix Operations",
                "text": "A vector space $V$ over a field $\\mathbb{R}$ is a set of elements closed under vector addition and scalar multiplication.\n\nThe dot product of vectors $u, v \\in \\mathbb{R}^n$ measures collinearity:\n$$u \\cdot v = u^T v = \\sum_{i=1}^{n} u_i v_i = \\|u\\| \\|v\\| \\cos(\\theta)$$\nTwo non-zero vectors are orthogonal if and only if $u \\cdot v = 0$.",
                "pages": [1, 2],
                "block_count": 4
            },
            "eigenvalues": {
                "section_name": "eigenvalues",
                "title": "Eigenvalues, Eigenvectors & Diagonalization",
                "text": "For a square matrix $A \\in \\mathbb{R}^{n \\times n}$, a non-zero vector $v$ is an eigenvector with corresponding eigenvalue $\\lambda$ if:\n$$A v = \\lambda v \\iff (A - \\lambda I) v = 0$$\nTo find eigenvalues, solve the Characteristic Equation:\n$$\\det(A - \\lambda I) = 0$$\nIf $A$ has $n$ linearly independent eigenvectors, it can be diagonalized as $A = P D P^{-1}$.",
                "pages": [3, 4, 5],
                "block_count": 5
            },
            "svd": {
                "section_name": "svd",
                "title": "Singular Value Decomposition (SVD)",
                "text": "Any matrix $A \\in \\mathbb{R}^{m \\times n}$ can be factored as:\n$$A = U \\Sigma V^T$$\nwhere $U \\in \\mathbb{R}^{m \\times m}$ is orthogonal (left singular vectors), $\\Sigma \\in \\mathbb{R}^{m \\times n}$ contains non-negative singular values on its diagonal, and $V \\in \\mathbb{R}^{n \\times n}$ is orthogonal (right singular vectors). SVD is the foundation of PCA and dimensionality reduction.",
                "pages": [6, 7],
                "block_count": 4
            }
        },
        "equations": [
            {
                "id": "eq-eigen",
                "page": 3,
                "raw_text": "A v = lambda v",
                "latex": r"A v = \lambda v \iff (A - \lambda I) v = 0, \quad \det(A - \lambda I) = 0",
                "description": "Eigenvalue-eigenvector relationship and characteristic polynomial equation."
            },
            {
                "id": "eq-svd",
                "page": 6,
                "raw_text": "A = U Sigma V^T",
                "latex": r"A = U \Sigma V^T = \sum_{i=1}^{r} \sigma_i u_i v_i^T",
                "description": "Singular Value Decomposition (SVD) matrix factorization."
            }
        ],
        "flashcards": [
            {
                "id": "fc-m1",
                "category": "Eigenvalues",
                "question": "What is the geometric meaning of an eigenvector of matrix $A$?",
                "answer": "An eigenvector $v$ is a direction that is only scaled by factor $\\lambda$ without changing its spatial direction when transformed by matrix $A$.",
                "difficulty": "Easy",
                "tags": ["Linear Algebra", "Eigenvalues"]
            }
        ],
        "concept_flow": {
            "title": "Matrix Diagonalization Workflow",
            "description": "Steps to compute eigenvalues, eigenvectors, and diagonal matrix representations.",
            "steps": [
                {
                    "step": 1,
                    "name": "Form Characteristic Equation",
                    "description": "Compute determinant $\\det(A - \\lambda I) = 0$.",
                    "formula": "\\det(A - \\lambda I) = 0",
                    "badge": "Step 1"
                },
                {
                    "step": 2,
                    "name": "Solve for Eigenvalues $\\lambda_i$",
                    "description": "Find roots of the characteristic polynomial.",
                    "formula": "\\lambda_1, \\lambda_2, \\dots, \\lambda_n",
                    "badge": "Step 2"
                },
                {
                    "step": 3,
                    "name": "Compute Nullspace Eigenvectors",
                    "description": "Solve $(A - \\lambda_i I)v = 0$ for each eigenvalue.",
                    "formula": "v_i \\in \\text{Null}(A - \\lambda_i I)",
                    "badge": "Step 3"
                }
            ]
        },
        "quiz": [
            {
                "id": "q-m1",
                "question": "A square matrix $A$ is invertible if and only if:",
                "options": [
                    "Its determinant is non-zero ($\\det(A) \\neq 0$)",
                    "Its trace is equal to 0",
                    "All of its entries are positive",
                    "It has at least one zero eigenvalue"
                ],
                "correct_index": 0,
                "rationale": "A matrix is invertible (non-singular) if and only if its determinant is non-zero, meaning its columns are linearly independent."
            }
        ]
    },

    "cs301-operating-systems-guide": {
        "id": "cs301-operating-systems-guide",
        "domain": "student",
        "filename": "CS301_Operating_Systems_and_Concurrency.docx",
        "file_type": "docx",
        "title": "CS301: Operating Systems & Process Scheduling Guide",
        "authors": ["Computer Systems & Systems Architecture Faculty"],
        "year": "2024",
        "total_pages": 10,
        "summary_cards": {
            "problem_statement": "Managing hardware resources, CPU scheduling, concurrency, deadlock prevention, and virtual memory management.",
            "core_architecture": "Process Control Blocks (PCB), Context Switching, CPU Scheduling Algorithms (Round Robin, FCFS, Shortest Job First), Semaphores & Mutexes, and Virtual Memory Paging.",
            "datasets_and_metrics": "Metrics: CPU Utilization, Turnaround Time, Waiting Time, Response Time, and Page Fault Rate.",
            "critical_limitations": "Exam traps: Deadlock conditions (Mutual exclusion, Hold & wait, No preemption, Circular wait) and Thrashing due to excessive page faults."
        },
        "sections": {
            "processes": {
                "section_name": "processes",
                "title": "Processes, Threads & Context Switching",
                "text": "A process is a program in execution containing program counter, stack, data, and heap.\n\nA thread is the basic unit of CPU utilization sharing the address space of its parent process. Context switching saves the state of the currently executing process into its PCB and restores another process state.",
                "pages": [1, 2],
                "block_count": 3
            },
            "scheduling": {
                "section_name": "scheduling",
                "title": "CPU Scheduling Algorithms",
                "text": "1. First-Come, First-Served (FCFS): Simple but suffers from the Convoy Effect.\n2. Shortest Job First (SJF): Optimal average waiting time but requires future knowledge of CPU burst times.\n3. Round Robin (RR): Preemptive scheduling with a fixed time quantum $q$. If $q$ is too small, context switch overhead dominates; if $q$ is too large, it degenerates into FCFS.",
                "pages": [3, 4],
                "block_count": 4
            },
            "deadlocks": {
                "section_name": "deadlocks",
                "title": "Deadlocks & The 4 Necessary Conditions",
                "text": "A deadlock occurs when a set of processes are blocked because each is holding a resource and waiting for another resource held by another process.\n\nThe 4 Coffman conditions:\n1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait\nBreaking any one of these four conditions guarantees deadlock prevention.",
                "pages": [5, 6],
                "block_count": 4
            }
        },
        "equations": [
            {
                "id": "eq-tat",
                "page": 3,
                "raw_text": "Turnaround Time = Completion Time - Arrival Time",
                "latex": r"\text{Turnaround Time} = T_{\text{completion}} - T_{\text{arrival}}, \quad \text{Waiting Time} = \text{Turnaround Time} - T_{\text{burst}}",
                "description": "Turnaround and Waiting time formulas for CPU scheduling algorithms."
            }
        ],
        "flashcards": [
            {
                "id": "fc-os1",
                "category": "Deadlocks",
                "question": "What are the 4 Coffman conditions necessary for a deadlock to occur?",
                "answer": "1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption, 4. Circular Wait.",
                "difficulty": "Good",
                "tags": ["Operating Systems", "Deadlocks", "Midterm"]
            }
        ],
        "concept_flow": {
            "title": "Process State Lifecycle",
            "description": "Transition between New, Ready, Running, Waiting, and Terminated states.",
            "steps": [
                {
                    "step": 1,
                    "name": "New State",
                    "description": "Process is being created and loaded into memory.",
                    "badge": "Created"
                },
                {
                    "step": 2,
                    "name": "Ready Queue",
                    "description": "Process is waiting in memory to be assigned to a CPU core.",
                    "badge": "Waiting for CPU"
                },
                {
                    "step": 3,
                    "name": "Running State",
                    "description": "CPU scheduler dispatches instructions to execution pipeline.",
                    "badge": "Executing"
                },
                {
                    "step": 4,
                    "name": "Waiting / I/O Blocked",
                    "description": "Process yields CPU while awaiting I/O or event completion.",
                    "badge": "Blocked"
                }
            ]
        },
        "quiz": [
            {
                "id": "q-os1",
                "question": "Which CPU scheduling algorithm achieves the theoretical minimum average waiting time for a given set of stationary processes?",
                "options": [
                    "First-Come First-Served (FCFS)",
                    "Shortest Job First (SJF)",
                    "Round Robin with large quantum",
                    "Priority Scheduling without aging"
                ],
                "correct_index": 1,
                "rationale": "Shortest Job First (SJF) is mathematically optimal in minimizing average waiting time because executing shortest tasks first reduces queuing delay for all subsequent processes."
            }
        ]
    }
}


# ==============================================================================
# 2. RESEARCHER BENCHMARK PAPERS (domain="researcher")
# ==============================================================================

RESEARCH_PAPERS: Dict[str, Dict[str, Any]] = {
    "attention-is-all-you-need": {
        "id": "attention-is-all-you-need",
        "domain": "researcher",
        "filename": "Attention_Is_All_You_Need.pdf",
        "file_type": "pdf",
        "title": "Attention Is All You Need",
        "authors": ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit", "Llion Jones", "Aidan N. Gomez", "Łukasz Kaiser", "Illia Polosukhin"],
        "year": "2017",
        "total_pages": 15,
        "summary_cards": {
            "problem_statement": "Recurrent and convolutional models for sequence transduction suffer from sequential computation constraints that prevent parallelization across long training sequences.",
            "core_architecture": "The Transformer architecture relies entirely on multi-head scaled dot-product self-attention mechanisms and sinusoidal positional encodings, dispensing with recurrence and convolutions.",
            "datasets_and_metrics": "WMT 2014 English-to-German: 28.4 BLEU; WMT 2014 English-to-French: 41.8 BLEU; Training cost: 3.5 days on 8 P100 GPUs.",
            "critical_limitations": "Quadratic computational and memory complexity O(N^2) relative to sequence length N; lack of inherent inductive bias for spatial/temporal hierarchies."
        },
        "sections": {
            "abstract": {
                "section_name": "abstract",
                "title": "Abstract",
                "text": "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.",
                "pages": [1],
                "block_count": 2
            },
            "introduction": {
                "section_name": "introduction",
                "title": "Introduction",
                "text": "Recurrent neural networks, particularly long short-term memory (LSTM) and gated recurrent (GRU) neural networks, have been firmly established as state-of-the-art approaches in sequence modeling. However, sequential computation remains a fundamental constraint. In this work, we propose the Transformer, which eschews recurrence and instead relies entirely on self-attention.",
                "pages": [1, 2],
                "block_count": 5
            },
            "methodology": {
                "section_name": "methodology",
                "title": "Model Architecture & Methodology",
                "text": "The Transformer follows an encoder-decoder structure using stacked self-attention and point-wise, fully connected layers for both the encoder and decoder.\n\nAn attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors. The output is computed as a weighted sum of the values, where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key.",
                "pages": [2, 3, 4, 5],
                "block_count": 8
            },
            "mathematical_formulation": {
                "section_name": "mathematical_formulation",
                "title": "Mathematical Formulation",
                "text": "Scaled Dot-Product Attention is computed as:\nAttention(Q, K, V) = softmax( (Q K^T) / sqrt(d_k) ) V\n\nMulti-Head Attention allows the model to jointly attend to information from different representation subspaces at different positions:\nMultiHead(Q, K, V) = Concat(head_1, ..., head_h) W^O\nwhere head_i = Attention(Q W_i^Q, K W_i^K, V W_i^V).",
                "pages": [4, 5],
                "block_count": 6
            },
            "experiments": {
                "section_name": "experiments",
                "title": "Experiments & Results",
                "text": "On the WMT 2014 English-to-German translation task, the big transformer model achieves 28.4 BLEU, outperforming existing best models including ensembles by over 2.0 BLEU. On the WMT 2014 English-to-French translation task, our model achieves a BLEU score of 41.8, establishing a new state-of-the-art.",
                "pages": [7, 8, 9],
                "block_count": 6
            },
            "limitations": {
                "section_name": "limitations",
                "title": "Limitations & Discussion",
                "text": "Full self-attention requires O(N^2) memory and compute operations with respect to sequence length N, making long context processing prohibitive without specialized sparse or linear attention approximations.",
                "pages": [10, 11],
                "block_count": 3
            }
        },
        "equations": [
            {
                "id": "eq-attn-1",
                "page": 4,
                "raw_text": "Attention(Q, K, V) = softmax( (Q K^T) / sqrt(d_k) ) V",
                "latex": r"\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{Q K^T}{\sqrt{d_k}}\right) V",
                "description": "Scaled Dot-Product Attention formula. The division by sqrt(d_k) prevents dot products from growing excessively large for large dimensions, which would push the softmax function into regions with extremely small gradients."
            },
            {
                "id": "eq-mha-2",
                "page": 5,
                "raw_text": "MultiHead(Q, K, V) = Concat(head_1, ..., head_h) W^O",
                "latex": r"\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \dots, \text{head}_h) W^O \quad \text{where} \quad \text{head}_i = \text{Attention}(Q W_i^Q, K W_i^K, V W_i^V)",
                "description": "Multi-Head Attention projects Queries, Keys, and Values linearly h times with different learnable projection matrices, enabling the model to jointly attend to information from different representation subspaces."
            }
        ],
        "metrics": [
            {"name": "BLEU (EN-DE)", "value": "28.4", "page": 8, "context": "New state-of-the-art on WMT 2014 English-to-German."},
            {"name": "BLEU (EN-FR)", "value": "41.8", "page": 8, "context": "Single model outperforming previous ensembles."},
            {"name": "Training Time", "value": "3.5 Days", "page": 9, "context": "Trained on 8 NVIDIA P100 GPUs."}
        ],
        "matrix_row": {
            "paper_id": "attention-is-all-you-need",
            "title": "Attention Is All You Need",
            "year": "2017",
            "authors": "Vaswani et al.",
            "methodology": "Multi-Head Self-Attention + Positional Encodings (Encoder-Decoder)",
            "dataset": "WMT 2014 EN-DE (4.5M pairs), WMT 2014 EN-FR (36M pairs)",
            "results_metric": "28.4 BLEU (EN-DE), 41.8 BLEU (EN-FR)",
            "limitations": "Quadratic O(N^2) memory & computational scaling with context length",
            "research_gaps": "Linear attention approximations, memory retention across infinite sequences, efficient causal inference"
        }
    },

    "yolov7": {
        "id": "yolov7",
        "domain": "researcher",
        "filename": "YOLOv7_Trainable_Bag_of_Freebies.pdf",
        "file_type": "pdf",
        "title": "YOLOv7: Trainable Bag-of-Freebies Sets New State-of-the-Art for Real-Time Object Detectors",
        "authors": ["Chien-Yao Wang", "Alexey Bochkovskiy", "Hong-Yuan Mark Liao"],
        "year": "2022",
        "total_pages": 15,
        "summary_cards": {
            "problem_statement": "Real-time object detectors often sacrifice accuracy for inference speed or introduce architectural overhead that complicates edge deployment.",
            "core_architecture": "Extended Efficient Layer Aggregation Network (E-ELAN) and Compound Scaling with auxiliary head coarse-to-fine lead guided label assignment.",
            "datasets_and_metrics": "MS COCO 2017 Test-Dev: 56.8% AP at 30+ FPS on V100; Outperforms all known real-time detectors.",
            "critical_limitations": "Reparameterization introduces training memory overhead and sensitivity to compound scaling ratios."
        },
        "sections": {
            "abstract": {
                "section_name": "abstract",
                "title": "Abstract",
                "text": "YOLOv7 surpasses all known object detectors in both speed and accuracy in the range from 5 FPS to 160 FPS and has the highest accuracy 56.8% AP among all known real-time object detectors with 30 FPS or higher on GPU V100.",
                "pages": [1],
                "block_count": 2
            },
            "methodology": {
                "section_name": "methodology",
                "title": "Extended ELAN Architecture & Compound Scaling",
                "text": "E-ELAN uses expand, shuffle, merge cardinality to continuously enhance the learning ability of the network without destroying the original gradient path.\n\nCompound model scaling simultaneously scales depth, width, and stage transitions proportionally to maintain optimal memory access cost (MAC).",
                "pages": [3, 4],
                "block_count": 5
            }
        },
        "equations": [
            {
                "id": "eq-yolo-1",
                "page": 4,
                "raw_text": "L_total = lambda_box * L_box + lambda_obj * L_obj + lambda_cls * L_cls",
                "latex": r"\mathcal{L}_{\text{total}} = \lambda_{\text{box}} \mathcal{L}_{\text{CIoU}} + \lambda_{\text{obj}} \mathcal{L}_{\text{obj}} + \lambda_{\text{cls}} \mathcal{L}_{\text{cls}}",
                "description": "Multi-task loss function combining Complete IoU (CIoU) bounding box regression, objectness confidence, and classification cross-entropy."
            }
        ],
        "metrics": [
            {"name": "mAP (COCO)", "value": "56.8%", "page": 6, "context": "Top performance at 30+ FPS."},
            {"name": "FPS (V100)", "value": "160 FPS", "page": 7, "context": "Inference throughput on NVIDIA V100."}
        ],
        "matrix_row": {
            "paper_id": "yolov7",
            "title": "YOLOv7: Trainable Bag-of-Freebies",
            "year": "2022",
            "authors": "Wang et al.",
            "methodology": "E-ELAN Architecture + Auxiliary Head Label Assignment",
            "dataset": "MS COCO 2017 (118K train, 5K val)",
            "results_metric": "56.8% AP @ 30+ FPS (V100)",
            "limitations": "Reparameterization training memory overhead",
            "research_gaps": "Sparse transformer hybrid heads, edge NPU dynamic quantization"
        }
    },

    "lora": {
        "id": "lora",
        "domain": "researcher",
        "filename": "LoRA_Low_Rank_Adaptation.pdf",
        "file_type": "pdf",
        "title": "LoRA: Low-Rank Adaptation of Large Language Models",
        "authors": ["Edward J. Hu", "Yelong Shen", "Phillip Wallis", "Zeyuan Allen-Zhu", "Yuanzhi Li", "Shean Wang", "Lu Wang", "Weizhu Chen"],
        "year": "2021",
        "total_pages": 14,
        "summary_cards": {
            "problem_statement": "Full fine-tuning of multi-billion parameter LLMs is computationally prohibitive and creates deployment friction when storing separate full weight copies per downstream task.",
            "core_architecture": "Freezes pre-trained weight matrices W_0 and injects trainable rank-decomposition matrices A and B into Transformer attention projections.",
            "datasets_and_metrics": "GLUE Benchmark, E2E NLG, WikiSQL; Matches or exceeds full fine-tuning with 10,000x fewer trainable parameters.",
            "critical_limitations": "Rank selection r must be tuned per task; does not accelerate multi-task batch inference if different adapters are merged."
        },
        "sections": {
            "abstract": {
                "section_name": "abstract",
                "title": "Abstract",
                "text": "Low-Rank Adaptation (LoRA) freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture, greatly reducing the number of trainable parameters for downstream tasks. LoRA can reduce the number of trainable parameters by 10,000 times and GPU memory requirement by 3 times compared to full fine-tuning.",
                "pages": [1],
                "block_count": 2
            },
            "methodology": {
                "section_name": "methodology",
                "title": "Low-Rank Parameter Decomposition",
                "text": "For a pre-trained weight matrix $W_0 \\in \\mathbb{R}^{d \\times k}$, LoRA constrains its update $\\Delta W$ with a low-rank decomposition:\n$$W = W_0 + \\Delta W = W_0 + \\frac{\\alpha}{r} B A$$\nwhere $B \\in \\mathbb{R}^{d \\times r}$, $A \\in \\mathbb{R}^{r \\times k}$, and the rank $r \\ll \\min(d, k)$. Matrix $A$ is initialized from a Gaussian distribution and $B$ is initialized to 0, ensuring $\\Delta W = 0$ at the start of training.",
                "pages": [2, 3, 4],
                "block_count": 5
            }
        },
        "equations": [
            {
                "id": "eq-lora-1",
                "page": 3,
                "raw_text": "h = W_0 x + Delta W x = W_0 x + (alpha/r) B A x",
                "latex": r"h = W_0 x + \Delta W x = W_0 x + \frac{\alpha}{r} B A x",
                "description": "LoRA forward pass formulation with scaling factor alpha / r."
            }
        ],
        "metrics": [
            {"name": "Parameter Reduction", "value": "10,000x", "page": 4, "context": "Fewer trainable parameters than full FT."},
            {"name": "VRAM Savings", "value": "3x", "page": 5, "context": "Reduction in training GPU memory."}
        ],
        "matrix_row": {
            "paper_id": "lora",
            "title": "LoRA: Low-Rank Adaptation of LLMs",
            "year": "2021",
            "authors": "Hu et al.",
            "methodology": "Low-Rank Matrix Decomposition (W_0 + alpha/r * B*A)",
            "dataset": "GLUE Benchmark, GPT-3 175B downstream adaptation",
            "results_metric": "Matches Full Fine-Tuning with 0.01% trainable weights",
            "limitations": "Inference latency overhead if adapters are dynamically switched",
            "research_gaps": "Dynamic rank allocation across layers (AdaLoRA), quantized rank merges"
        }
    },

    "deepseek-r1": {
        "id": "deepseek-r1",
        "domain": "researcher",
        "filename": "DeepSeek_R1_Reasoning_via_RL.pdf",
        "file_type": "pdf",
        "title": "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning",
        "authors": ["DeepSeek-AI", "Research Team"],
        "year": "2025",
        "total_pages": 24,
        "summary_cards": {
            "problem_statement": "Supervised fine-tuning (SFT) for reasoning models requires massive amounts of human-curated chain-of-thought data, limiting scaling potential.",
            "core_architecture": "Pure reinforcement learning using Group Relative Policy Optimization (GRPO) without a separate critic model, discovering self-verification behaviors.",
            "datasets_and_metrics": "AIME 2024: 79.8% pass@1; MATH-500: 97.3%; Codeforces: 96.3 percentile.",
            "critical_limitations": "Intermediate language mixing and verbose exploration token latency during complex reasoning."
        },
        "sections": {
            "abstract": {
                "section_name": "abstract",
                "title": "Abstract",
                "text": "We introduce DeepSeek-R1-Zero and DeepSeek-R1. DeepSeek-R1-Zero is trained via large-scale reinforcement learning without supervised fine-tuning as a preliminary step, demonstrating remarkable reasoning capabilities through pure RL.",
                "pages": [1],
                "block_count": 2
            }
        },
        "equations": [
            {
                "id": "eq-grpo-1",
                "page": 4,
                "raw_text": "A_i = (r_i - mean(r)) / (std(r) + eps)",
                "latex": r"A_i = \frac{r_i - \text{mean}(\{r_j\}_{j=1}^G)}{\text{std}(\{r_j\}_{j=1}^G) + \epsilon}",
                "description": "Group Relative Policy Optimization (GRPO) advantage calculation across sampled response candidates."
            }
        ],
        "metrics": [
            {"name": "AIME 2024", "value": "79.8%", "page": 8, "context": "Pass@1 on competitive mathematical olympiad."},
            {"name": "MATH-500", "value": "97.3%", "page": 9, "context": "State-of-the-art mathematical problem solving."}
        ],
        "matrix_row": {
            "paper_id": "deepseek-r1",
            "title": "DeepSeek-R1: Reasoning via RL",
            "year": "2025",
            "authors": "DeepSeek-AI",
            "methodology": "Pure Reinforcement Learning (GRPO) without Supervised Warmup",
            "dataset": "AIME 2024, MATH-500, Codeforces, GPQA Diamond",
            "results_metric": "79.8% AIME 2024 pass@1, 97.3% MATH-500",
            "limitations": "Intermediate language mixing and verbose exploration token latency",
            "research_gaps": "Test-time compute scaling laws, multi-modal reasoning distillation"
        }
    }
}

# Combined dictionary for backward compatibility and unified lookup
SAMPLE_PAPERS: Dict[str, Dict[str, Any]] = {
    **STUDENT_MATERIALS,
    **RESEARCH_PAPERS
}
