**Hospital Chatbot for Color Coded Clinical Pathways**  
Introduction

Hospitals in Ghana face over crowding, delayed first assessment and a failure we call acuity discontinuity. In resource constrained settings like Ghana, delays in triage can lead to long wait times and poor patient outcomes. This thesis presents a hospital chatbot that will map patient complaints by interacting with them, gather symptoms and assign a color code that indicates the urgency of their situation and then route them to their respective clinical pathway.  
Triage represents more than simple sorting; it is the fundamental mechanism that aligns patient acuity with resource allocation. In high-functioning health systems, this process is dynamic and continuous. However, in resource-constrained settings like Ghana, standardized triage protocols such as the South African Triage Scale (SATS) often face implementation barriers. When the triage process is isolated to the front desk, the hospital ecosystem frequently loses sight of a patient's urgency as they move through diagnostics and wards. This thesis proposes a digital 'Flow Management Engine' that extends the triage process beyond the initial point of contact, ensuring that a patient's color-coded acuity level dictates their care pathway throughout their entire hospital stay.

Problem Statement  
In many Low and Middle income countries, hospitals struggle witih crowded waiting rooms and limit human resources. Patients might have to wait hours before their initial assessment.  
This delay in triage can result in critical cases not being identified fast enough and less urgent cases congesting emergency departments.  
Because medical systems are confusing and patients don't get quick directions, they often don't know where to go when they arrive, which makes the hospital even more crowded.  
We need an easy-to-use system that quickly figures out how urgent a patient's condition is (using color codes) and directs them to the right place.  
This will help cut down on wait times and make sure patients who need urgent help get it right away.  
The current reliance on manual, paper-based triage creates an 'Acuity Discontinuity' where patient status becomes static rather than dynamic. This gap leads to two primary systemic failures:

1. The 'Lost Urgency' phenomenon, where critical patients triaged as 'Orange' or 'Red' lose their time-critical priority when moving to secondary diagnostic units, resulting in avoidable delays.  
2. The congestion of acute care zones by 'Green' (non-urgent) patients due to a lack of automated guidance, which effectively blocks beds and resources needed for life-saving interventions.

Without a digital framework to manage this flow, hospitals remain locked in a cycle of overcrowding and resource mismatch, where the most vulnerable patients are often the most invisible to the system once they leave the primary triage area.

Objectives

* **Automated Triage Classification:** To develop a chatbot capable of processing patient complaints, symptoms, and medical histories to generate accurate triage assessments based on clinical severity.  
* **Guided Clinical Pathways:** To provide patients with immediate, actionable guidance, such as directing critical (red) cases to emergency care or offering self-care recommendations for non-urgent (green) cases.  
* **Integration with Hospital Protocols:** To align the chatbot’s decision-making logic with established triage frameworks and clinical pathways, ensuring that all recommendations are evidence-based and safe.

* **Data-Driven System Optimization:** To utilize anonymized patient data to iteratively refine the triage algorithm and provide administrators with analytical insights into patient flow and common clinical presentations.

		

Methodology  
The chatbot will leverage the Triage Early Warning Score system(TEWS)\[there should be the triage early warning score formula and a coloured the piecewise function / chart showing how it works and what each numbers means and where every parameter comes from should be explained as well\] and a Deep Attention Model to simulate the triage process.  
When patients input their complaints or symptoms, the system will use the pre programmed clinical pathways to assess the case.  
These pathways are essentially encoded medical protocols that map symptoms to urgency levels.  
For example, the patient’s complaints are inputed in into the chatbot, and then based on the complaints, it assigns a color urgency level  
Under the hood, this is what is happening  
Bert(Biconditional Encoder representation of transformers), stemming from attention is all you need\[we should reference the paper here\], the premise of the model  
Unlike older models that read text sequentially (left-to-right or right-to-left), BERT processes words **bidirectionally**;meaning it analyzes the entire context of a sentence simultaneously by looking at the words before and after a target word. This allows the system to accurately understand the precise context and nuance of ambiguous language.  
But what we are trying to achieve, bert is not enough,  
So we introduce Biobert, a pretrained biomedical model  
**BioBERT**, which stands for **Biomedical Bidirectional Encoder Representations from Transformers**, is a domain-specific language representation model tailored specifically for medical and life science text mining  
Biobert has also been retrained with different medical data and patient complaints and has been finetuned to achieve a certain level of accuracy

\[at this point, we start with the math\]  
How the text is imputed,what happens when it enters the model, and what the output looks like  
We should talk about the tokenisation, the embedding, and all the various stages through to the output  
We talk about all the math, with formulas explained detaildly, the formulas should be used, there should be an example, a standard medical complaint at the top, something that looks like it would come from a  patient, and then it passes through all these and we see how it actually works, but then we should be able to keep the whole thing generic as well, state the formlas first with all the parameters and variables and everything explained

We should make sure the multi head attention formula is there as well and explained   
We should make sure the math involves the math of bert and biobert explained detaildly

And the input representations  
E(token) \= Eword \+ Eposition \+ Segment  
The input, tokenisation, feature extraction, dimension reduction, classification output

And how do the pathways works, the concept of patient streaming  
We should go ahead to talk about the medical gate feature and how it works, the math behind it, how the non medical cases are identified early on

The analysis and results and conlusion will come later