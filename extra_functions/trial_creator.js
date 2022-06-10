function trial_creator(all_conditions) {

    let all_trials = []

    // A function to create a cartesian product of two arrays
    const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));

    Object.keys(all_conditions).forEach(function (iCond, index) {
        // iCond = 'no_schema'

        //console.log('Condition: ', iCond)

        let iCondStages = all_conditions[iCond]

        let n_trials_per_pa = jatos.studySessionData.inputData.n_trials_per_pa[iCond]

        let istage_n_ses = jatos.studySessionData.inputData.n_ses_per_condition[iCond]
        
        var visible_pas_coords = jatos.studySessionData.inputData.condition_coords[iCond].visible_pas

        var visible_pas_coords2 = jatos.studySessionData.inputData.condition_to_arrangements[iCond].filter(item => item.pa_type == 'visible')

        // Landmark visible PA indices
        var visible_pas_near_idxs = visible_pas_coords2.map(item => item.subtype == 'near').flatMap(
            (bool, index) => bool ? index : []
            )

        var hidden_pas_coords = jatos.studySessionData.inputData.condition_to_arrangements[iCond].filter(item => item.pa_type == 'hidden')

        for (iBlock = 0; iBlock < istage_n_ses; iBlock++) {
            
            //console.log('session: ',iBlock)

            var block_trials = []

            for (iPA = 0; iPA < iCondStages.hidden_pas.length; iPA++) {

                //console.log('PA: ',iPA)

                for (iRep = 0; iRep < n_trials_per_pa; iRep++) {
                    // debugger
                    
                    //console.log('Repetition: ',iRep)

                    // Which rows and cols are allowed?
                    let allowed_rows = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
                    let allowed_cols = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
                    let allowed_rc = cartesian(allowed_rows, allowed_cols)

                    // From the allowed_rc, remove the row/col that are the hidden PA locations
                    
                    // The code below loops through each of hidden PAs, and for each it finds a matching 
                    // row-column in the allowed_rc and removes them from the allowed_rc 
                    hidden_pas_coords.forEach(
                        function(item,index,arr){
                            allowed_rc = allowed_rc.filter(e => !_.isEqual(e, [item.row,item.column]))
                        }
                    )

                    // Shuffle the coordinates of the schema PAs if its IC condition
                    if (iCond == 'schema_ic') {
                        
                        visible_pas_coords = jsPsych.randomization.shuffle(visible_pas_coords)
                        visible_pas_coords2 = jsPsych.randomization.shuffle(visible_pas_coords2)
                   
                    } else if (iCond == 'practice2' | iCond == 'schema_l' | iCond == 'random_loc') {

                        let landmark_rcs = visible_pas_coords2.filter(item => item.subtype == 'near')

                        // If its random locations, then we don't have any landmark visible PAs. So, clear these variables
                        // such that they are not checked against when creating new locations
                        if (iCond == 'random_loc'){
                            // debugger
                            landmark_rcs = []
                            visible_pas_near_idxs = []
                        }

                        // Reset, to repopulate
                        visible_pas_coords  = []
                        visible_pas_coords2 = []

                        // Create a variable against which to check new locations
                        var check_against = [...landmark_rcs]

                        // Then, create a random location of 6 landmarks

                        // The code below loops through each of landmark visible PAs, and for each it finds a matching 
                        // row-column in the allowed_rc and removes them from the allowed_rc 
                        landmark_rcs.forEach(
                            function(item,index,arr){
                                allowed_rc = allowed_rc.filter(e => !_.isEqual(e, [item.row,item.column]))
                            }
                        )

                        for (iLoc = 0; iLoc <= 5; iLoc++) {

                            // If its practice2 or schema_l, then, once you get to the PA which is a landmark-PA, don't 
                            // generate a random location, but instead just record the existing landmark PA characteristics.
                            if (visible_pas_near_idxs.includes(iLoc)){

                                let which_visible_near = visible_pas_near_idxs.indexOf(iLoc)

                                    visible_pas_coords2[visible_pas_near_idxs[which_visible_near]] = landmark_rcs[which_visible_near]
                                    continue
                            }

                            // Randomly choose one of those
                            let rand_rc = jsPsych.randomization.sampleWithoutReplacement(allowed_rc, 1)[0]

                            // Do a while loop till all conditions are satisfied
                            let cond_sat = false

                            while (cond_sat == false) {

                                // Temporarily set to true, change if any distance is less than X
                                cond_sat = true

                                // If all the distances are ok
                                for (iCheck = 0; iCheck < check_against.length; iCheck++) {

                                    var iDist = math.distance(
                                        [check_against[iCheck].row,check_against[iCheck].column],rand_rc
                                    )

                                    if (iDist < 1.9) {
                                        cond_sat = false
                                        break
                                    }
                                }

                                if (cond_sat == false) {

                                    // generate another row
                                    rand_rc = jsPsych.randomization.sampleWithoutReplacement(allowed_rc, 1)[0]

                                }
                            } // while

                            // Remove from the choice options
                            const idx = allowed_rc.indexOf(rand_rc)
                            allowed_rc.splice(idx, 1)

                            // Add this to the visible_pas_coords vector
                            visible_pas_coords[iLoc] = [...rand_rc]

                            check_against[check_against.length] = {
                                arrangement: jatos.studySessionData.inputData.condition_to_arrangements[iCond][0].arrangement,
                                pa_type: 'visible',
                                hidden_type: '',
                                row: rand_rc[0],
                                column: rand_rc[1]
                            } 

                            visible_pas_coords2[iLoc] = {
                                arrangement: jatos.studySessionData.inputData.condition_to_arrangements[iCond][0].arrangement,
                                pa_type: 'visible',
                                hidden_type: '',
                                row: rand_rc[0],
                                column: rand_rc[1]
                            }                            

                        } // iLoc

                    } else if (iCond == 'no_schema') {

                        // Delete this
                        var visible_pas_coords  = []
                        var visible_pas_coords2 = []

                    } // which condition
                    // debugger

                    var trial = {
                        hidden_pa_img: iCondStages.hidden_pas[iPA],
                        hidden_pa_img_idx: iPA,
                        hidden_pa_img_coords: jatos.studySessionData.inputData.condition_coords[iCond].hidden_pas[iPA],
                        hidden_pa_img_coods2: hidden_pas_coords[iPA],
                        hidden_pa_all_imgs: iCondStages.hidden_pas,
                        hidden_pa_all_img_coords: jatos.studySessionData.inputData.condition_coords[iCond].hidden_pas,
                        hidden_pa_all_img_coords2: hidden_pas_coords,
                        visible_pa_imgs: iCondStages.visible_pas,
                        visible_pa_img_coords: visible_pas_coords,
                        visible_pa_img_coords2: visible_pas_coords2,
                        condition: iCond,
                        color: jatos.studySessionData.inputData.condition_colors[iCond],
                        color_name: jatos.studySessionData.inputData.condition_color_names[iCond],
                        block: iBlock,
                        top_offset_visible_pa_display: Math.floor(Math.random() * 160),
                        left_offset_visible_pa_display: Math.floor(Math.random() * 160)

                    }

                    if (jatos.studySessionData.inputData.move_board_within_trial) {
                        trial['top_offset_hidden_pa_learning'] = Math.floor(Math.random() * 160)
                        trial['left_offset_hidden_pa_learning'] = Math.floor(Math.random() * 160)
                    } else {
                        trial['top_offset_hidden_pa_learning'] = trial['top_offset_visible_pa_display']
                        trial['left_offset_hidden_pa_learning'] = trial['left_offset_visible_pa_display']
                    }

                    block_trials.push(trial)

                } // iRep

            } // iPA

            if (iCond == 'practice' | iCond == 'practice2') {
                block_trials = jsPsych.randomization.shuffle(block_trials)
            } else {

                // Make sure trials aren't back to back for the same image
                block_trials = jsPsych.randomization.shuffleNoRepeats(block_trials, function (a, b) { return a.hidden_pa_img === b.hidden_pa_img })
            }

            // Add a key about the trial counter and random offset 
            // This isn't done in the above loop, because for some conditions the block_trials get shuffled!
            for (iT = 0; iT < block_trials.length; iT++) {

                // Trial counter prompt
                block_trials[iT]['trial_counter_prompt'] = '<p>Trial ' + (iT + 1) + '/' + block_trials.length + '</p>'

                // Trial counter itself
                block_trials[iT]['trial_counter'] = iT

            }
            // debugger
            all_trials.push(block_trials)
        } // iBlock
    });
    // debugger

    return all_trials
}