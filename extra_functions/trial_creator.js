function trial_creator(all_conditions){

    let all_trials = []
    let n_trials_per_pa  = jatos.studySessionData.inputData.n_trials_per_pa
    // let n_trials_per_ses = n_trials_per_pa * stimuli.consistent_schema.length


    // for (iSes=0; iSes<jatos.studySessionData.inputData.n_schema_ses_per_cond; iSes++){

        Object.keys(all_conditions).forEach(function(iCond,index){
            debugger
            let iCondStages = all_conditions[iCond]

            Object.keys(iCondStages).forEach(function(stage,counter){

                let iStageStimuli = iCondStages[stage]

                    let n_trials_per_ses = n_trials_per_pa * iStageStimuli.length
                    let istage_n_ses = []

                    if (stage == 'schema_learning'){
                        istage_n_ses = jatos.studySessionData.inputData.n_schema_ses_per_cond
                    } else {
                        istage_n_ses = jatos.studySessionData.inputData.n_new_pa_ses_per_cond                       
                    }

                    for (iSes=0; iSes<istage_n_ses; iSes++){

                        let allpas    = []
                        let allpaidxs = []

                        for (iSt=0; iSt<iStageStimuli.length; iSt++){
                            let pa_stimuli = Array(n_trials_per_pa).fill(iStageStimuli[iSt])
                            let pa_idxs    = Array(n_trials_per_pa).fill((iSt+1))

                            allpas.push(...pa_stimuli)
                            allpaidxs.push(...pa_idxs)
                        }
                        let session_trials = []
                        for (i=0; i < n_trials_per_ses; i++){

                            session_trials[i] = {
                                color: jatos.studySessionData.inputData.condition_colors[iCond],
                                img_path: allpas[i],
                                stimulus_idx: allpaidxs[i],
                                condition: iCond,
                                stage: stage,
                            }
                        }
                        // randomize the order of the trials 
                        // debugger
                        session_trials = 
                        jsPsych.randomization.shuffleNoRepeats(session_trials,function(a,b){return a.img_path === b.img_path})

                        all_trials.push(session_trials)
                    }
            })






        });
    // }

    return all_trials
}