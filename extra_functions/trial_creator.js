function trial_creator(all_conditions){

    let all_trials = []

    Object.keys(all_conditions).forEach(function(iCond,index){
        // debugger
        let iCondStages = all_conditions[iCond]

        Object.keys(iCondStages).forEach(function(stage,counter){
            let n_trials_per_pa  = jatos.studySessionData.inputData.n_trials_per_pa[stage]
            let iStageStimuli = iCondStages[stage]

                let n_trials_per_ses = n_trials_per_pa * iStageStimuli.length
                let istage_n_ses = jatos.studySessionData.inputData.n_ses_per_condition[stage]

                for (iSes=0; iSes<istage_n_ses; iSes++){

                    let allpas      = []
                    let allpaidxs   = []
                    let allpacoords = []

                    // Which coordinates to use
                    let iCoordsForAllSessions = jatos.studySessionData.inputData.condition_coords[iCond][stage]['ses'+(iSes+1)]

                    for (iSt=0; iSt<iStageStimuli.length; iSt++){
                        let pa_stimuli = Array(n_trials_per_pa).fill(iStageStimuli[iSt])
                        let pa_idxs    = Array(n_trials_per_pa).fill((iSt+1))
                        let pa_coords  = Array(n_trials_per_pa).fill(iCoordsForAllSessions[iSt])

                        allpas.push(...pa_stimuli)
                        allpaidxs.push(...pa_idxs)
                        allpacoords.push(...pa_coords)
                    }
                    let session_trials = []
                    for (i=0; i < n_trials_per_ses; i++){

                        session_trials[i] = {
                            color: jatos.studySessionData.inputData.condition_colors[iCond],
                            img_path: allpas[i],
                            stimulus_idx: allpaidxs[i],
                            condition: iCond,
                            stage: stage,
                            coords: allpacoords[i]
                        }
                    }
                    // randomize the order of the trials 
                    // debugger

                    if (stage=='practice'){
                        session_trials = jsPsych.randomization.shuffle(session_trials)
                    } else {
                        session_trials = jsPsych.randomization.shuffleNoRepeats(session_trials,function(a,b){return a.img_path === b.img_path})
                    }
               

                    // Add a key about the trial counter and random offset 
                    for (iT=0; iT < session_trials.length; iT++){

                        // Trial counter
                        session_trials[iT]['trial_counter_prompt'] = '<p>Trial ' + (iT+1) + '/' + session_trials.length +'</p>'

                        // top and left offsets
                        session_trials[iT]['top_offset'] = Math.floor(Math.random() * 180)
                        session_trials[iT]['left_offset'] = Math.floor(Math.random() * 180)

                    }
                    // debugger
                    all_trials.push(session_trials)
                }
        })
    });
    // debugger

    return all_trials
}