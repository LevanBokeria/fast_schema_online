function trial_creator(){

    let all_session_trials = []
    let n_trials_per_ses = jatos.studySessionData.inputData.n_trials_per_ses
    let n_trials_per_pa  = jatos.studySessionData.inputData.n_trials_per_pa

    for (iSes=0; iSes<=jatos.studySessionData.inputData.n_ses_per_cond; iSes++){

        Object.keys(jatos.studySessionData.inputData.condition_stimuli).forEach(function(curr_condition,index){
            
            let curr_stimuli = jatos.studySessionData.inputData.condition_stimuli[curr_condition]
            
            let pa1 = Array(n_trials_per_pa).fill(curr_stimuli[0])
            let pa2 = Array(n_trials_per_pa).fill(curr_stimuli[1])
            let pa3 = Array(n_trials_per_pa).fill(curr_stimuli[2])
        
            let allpas = pa1.concat(pa2).concat(pa3)
        
            let pa_idx1 = Array(n_trials_per_pa).fill(1)
            let pa_idx2 = Array(n_trials_per_pa).fill(2)
            let pa_idx3 = Array(n_trials_per_pa).fill(3)
        
            let allpaidxs = pa_idx1.concat(pa_idx2).concat(pa_idx3)
          
            let session_trials = []

            for (i=0; i<=jatos.studySessionData.inputData.n_trials_per_ses; i++){

                session_trials[i] = {
                    color: jatos.studySessionData.inputData.condition_colors[curr_condition],
                    img_path: allpas[i],
                    stimulus_idx: allpaidxs[i],
                    condition: curr_condition,
                }
            }

            all_session_trials.push(session_trials)

        });
    }

    return all_session_trials
}