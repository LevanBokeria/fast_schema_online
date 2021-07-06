function trial_creator2(all_conditions){
    // debugger
    let all_trials = []

    Object.keys(all_conditions).forEach(function(iCond,index){
        // debugger
        let iCondStages = all_conditions[iCond]

            let n_trials_per_pa  = jatos.studySessionData.inputData.n_trials_per_pa[iCond]

            let n_trials_per_ses = n_trials_per_pa * iCondStages.schema_learning.length
            let istage_n_ses = jatos.studySessionData.inputData.n_ses_per_condition[iCond]

            var schema_learning_coords = jatos.studySessionData.inputData.condition_coords[iCond].schema_learning

            for (iSes=0; iSes<istage_n_ses; iSes++){

                var session_trials = []

                for (iPA=0; iPA<iCondStages.schema_learning.length; iPA++){

                    for (iRep=0; iRep<n_trials_per_pa; iRep++){

                        // Shuffle the coordinates of the schema PAs if its IC condition
                        if (iCond == 'schema_ic'){
                            schema_learning_coords = jsPsych.randomization.shuffle(schema_learning_coords)
                        }

                        var trial = {
                            new_pa_img: iCondStages.new_pa_learning[iPA],
                            new_pa_img_idx: iPA,
                            new_pa_all_imgs: iCondStages.new_pa_learning,
                            new_pa_all_img_coords: jatos.studySessionData.inputData.condition_coords[iCond].new_pa_learning,
                            schema_pa_imgs: iCondStages.schema_learning,
                            schema_pa_img_coords: schema_learning_coords,
                            condition: iCond,
                            color: jatos.studySessionData.inputData.condition_colors[iCond],
                            border_pattern: jatos.studySessionData.inputData.condition_border_patterns[iCond],
                            session: iSes,
                        }

                        session_trials.push(trial)

                    } // iRep
                
                } // iPA

                session_trials = jsPsych.randomization.shuffleNoRepeats(session_trials,function(a,b){return a.new_pa_img === b.new_pa_img})
        
                // Add a key about the trial counter and random offset 
                for (iT=0; iT < session_trials.length; iT++){

                    // Trial counter
                    session_trials[iT]['trial_counter_prompt'] = '<p>Trial ' + (iT+1) + '/' + session_trials.length +'</p>'

                    // top and left offsets
                    session_trials[iT]['top_offset'] = Math.floor(Math.random() * 160)
                    session_trials[iT]['left_offset'] = Math.floor(Math.random() * 160)

                }
                // debugger
                all_trials.push(session_trials)
            }
    });
    // debugger

    return all_trials
}