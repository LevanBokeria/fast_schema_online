function trial_creator(stimuli){

    let all_trials = []
    let n_trials_per_pa  = jatos.studySessionData.inputData.n_trials_per_pa
    let n_trials_per_ses = n_trials_per_pa * stimuli.consistent_schema.length


    for (iSes=0; iSes<jatos.studySessionData.inputData.n_schema_ses_per_cond; iSes++){

        Object.keys(stimuli).forEach(function(curr_condition,index){
            // debugger
            let curr_stimuli = stimuli[curr_condition]
            let allpas    = []
            let allpaidxs = []

            for (iSt=0; iSt<curr_stimuli.length; iSt++){

                let pa_stimuli = Array(n_trials_per_pa).fill(curr_stimuli[iSt])
                let pa_idxs    = Array(n_trials_per_pa).fill((iSt+1))

                allpas.push(...pa_stimuli)
                allpaidxs.push(...pa_idxs)

            }
          
            let session_trials = []

            for (i=0; i < n_trials_per_ses; i++){

                session_trials[i] = {
                    color: jatos.studySessionData.inputData.condition_colors[curr_condition],
                    img_path: allpas[i],
                    stimulus_idx: allpaidxs[i],
                    condition: curr_condition,
                }
            }

            // randomize the order of the trials 
            // debugger
            session_trials = 
            jsPsych.randomization.shuffleNoRepeats(session_trials)

            all_trials.push(session_trials)

        });
    }

    return all_trials
}