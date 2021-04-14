/**
 * jspsych-serial-reaction-time
 * Josh de Leeuw
 *
 * plugin for running a serial reaction time task
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["playground"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'playground',
    description: '',
    parameters: {
    //   target: {
    //     type: jsPsych.plugins.parameterType.INT,
    //     pretty_name: 'Target',
    //     array: true,
    //     default: undefined,
    //     description: 'The location of the target. The array should be the [row, column] of the target.'
    //   },
    //   grid: {
    //     type: jsPsych.plugins.parameterType.BOOL,
    //     pretty_name: 'Grid',
    //     array: true,
    //     default: [[1,1,1,1]],
    //     description: 'This array represents the grid of boxes shown on the screen.'
    //   },
    //   grid_square_size: {
    //     type: jsPsych.plugins.parameterType.INT,
    //     pretty_name: 'Grid square size',
    //     default: 100,
    //     description: 'The width and height in pixels of each square in the grid.'
    //   },
    //   target_color: {
    //     type: jsPsych.plugins.parameterType.STRING,
    //     pretty_name: 'Target color',
    //     default: "#999",
    //     description: 'The color of the target square.'
    //   },
    //   response_ends_trial: {
    //     type: jsPsych.plugins.parameterType.BOOL,
    //     pretty_name: 'Response ends trial',
    //     default: true,
    //     description: 'If true, the trial ends after a mouse click.'
    //   },
    //   pre_target_duration: {
    //     type: jsPsych.plugins.parameterType.INT,
    //     pretty_name: 'Pre-target duration',
    //     default: 0,
    //     description: 'The number of milliseconds to display the grid before the target changes color.'
    //   },
    //   trial_duration: {
    //     type: jsPsych.plugins.parameterType.INT,
    //     pretty_name: 'Trial duration',
    //     default: null,
    //     description: 'How long to show the trial'
    //   },
    //   fade_duration: {
    //     type: jsPsych.plugins.parameterType.INT,
    //     pretty_name: 'Fade duration',
    //     default: null,
    //     description: 'If a positive number, the target will progressively change color at the start of the trial, with the transition lasting this many milliseconds.'
    //   },
    //   allow_nontarget_responses: {
    //     type: jsPsych.plugins.parameterType.BOOL,
    //     pretty_name: 'Allow nontarget response',
    //     default: false,
    //     description: 'If true, then user can make nontarget response.'
    //   },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    var startTime = -1;
    var response = {
      rt: null,
      row: null,
      column: null
    }

    // Create the grid box element
    let grid_box = document.createElement('div')
    grid_box.id = 'grid_box'
    grid_box.style = 
        'display: grid;' +
        'grid-template-columns: repeat(12, 30px);' +
        'grid-template-rows: repeat(12, 30px);' +
        'background-color: red;' +
        'border: 2px solid #444;' +
        'grid-gap: 2px 2px;'

    display_element.appendChild(grid_box)

    // Add the cells
    let n_rows = 12
    let n_cols = 12

    for (ir = 0; ir < n_rows; ir++){

      for (ic = 0; ic < n_cols; ic++){

        iCell = document.createElement('div')

        iCell.className = 'cells'
        iCell.id = 'cell_r_' + (ir+1) + '_c_' + (ic+1)

        iCell.style = 
          'background-color: white;'

        grid_box.appendChild(iCell)

      }

    }

    // Add the image items at specific locations
    let img_array = ['./img/targets/BOSS/downsized/8ball.jpg',
                     './img/targets/BOSS/downsized/accordion01.jpg',
                     './img/targets/BOSS/downsized/acorn.jpg']

    let img_board_coords = [[1,1],
                            [5,5],
                            [7,7]]

    for (iImg = 0; iImg < img_array.length; iImg++){

      // Which row and col?
      let i_row = img_board_coords[iImg][0]
      let i_col = img_board_coords[iImg][1]

      iEl = document.createElement('img')

      iEl.className = 'PA'
      iEl.id = 'PA_' + (iImg+1)
      iEl.src = img_array[iImg]
      iEl.style = 
        'max-width: 100%;' +
        'height: auto;' + 
        'visibility: hidden;'

      let iCell = document.querySelector('#cell_r_' + i_row + '_c_' + i_col)
      iCell.appendChild(iEl)

      iCell.onclick = function make_visible(){
        this.children[0].style.visibility = 'visible'
      }

      debugger
    }


    // display stimulus
    // var stimulus = this.stimulus(trial.grid, trial.grid_square_size);
    // display_element.innerHTML = stimulus;


	// 	if(trial.pre_target_duration <= 0){
	// 		showTarget();
	// 	} else {
	// 		jsPsych.pluginAPI.setTimeout(function(){
	// 			showTarget();
	// 		}, trial.pre_target_duration);
	// 	}

		//show prompt if there is one
    if (trial.prompt !== null) {
      display_element.insertAdjacentHTML('beforeend', trial.prompt);
    }

	// 	function showTarget(){
    //   var resp_targets;
    //   if(!trial.allow_nontarget_responses){
    //     resp_targets = [display_element.querySelector('#jspsych-serial-reaction-time-stimulus-cell-'+trial.target[0]+'-'+trial.target[1])]
    //   } else {
    //     resp_targets = display_element.querySelectorAll('.jspsych-serial-reaction-time-stimulus-cell');
    //   }
    //   for(var i=0; i<resp_targets.length; i++){
    //     resp_targets[i].addEventListener('mousedown', function(e){
    //       if(startTime == -1){
    //         return;
    //       } else {
    //         var info = {}
    //         info.row = e.currentTarget.getAttribute('data-row');
    //         info.column = e.currentTarget.getAttribute('data-column');
    //         info.rt = performance.now() - startTime;
    //         after_response(info);
    //       }
    //     });
    //   }

    //   startTime = performance.now();

    //   if(trial.fade_duration == null){
    //     display_element.querySelector('#jspsych-serial-reaction-time-stimulus-cell-'+trial.target[0]+'-'+trial.target[1]).style.backgroundColor = trial.target_color;
    //   } else {
    //     display_element.querySelector('#jspsych-serial-reaction-time-stimulus-cell-'+trial.target[0]+'-'+trial.target[1]).style.transition = "background-color "+trial.fade_duration;
    //     display_element.querySelector('#jspsych-serial-reaction-time-stimulus-cell-'+trial.target[0]+'-'+trial.target[1]).style.backgroundColor = trial.target_color;
    //   }

	// 		if(trial.trial_duration !== null){
	// 			jsPsych.pluginAPI.setTimeout(endTrial, trial.trial_duration);
	// 		}

	// 	}

    function endTrial() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        rt: response.rt,
				grid: trial.grid,
				target: trial.target,
        response: [parseInt(response.row,10), parseInt(response.column,10)],
        correct: response.row == trial.target[0] && response.column == trial.target[1]
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);

    };

    // function to handle responses by the subject
    function after_response(info) {

			// only record first response
      response = response.rt == null ? info : response;

      if (trial.response_ends_trial) {
        endTrial();
      }
    };

  };

//   plugin.stimulus = function(grid, square_size, target, target_color, labels) {
//     var stimulus = "<div id='jspsych-serial-reaction-time-stimulus' style='margin:auto; display: table; table-layout: fixed; border-spacing:"+square_size/4+"px'>";
//     for(var i=0; i<grid.length; i++){
//       stimulus += "<div class='jspsych-serial-reaction-time-stimulus-row' style='display:table-row;'>";
//       for(var j=0; j<grid[i].length; j++){
//         var classname = 'jspsych-serial-reaction-time-stimulus-cell';

//         stimulus += "<div class='"+classname+"' id='jspsych-serial-reaction-time-stimulus-cell-"+i+"-"+j+"' "+
//           "data-row="+i+" data-column="+j+" "+
//           "style='width:"+square_size+"px; height:"+square_size+"px; display:table-cell; vertical-align:middle; text-align: center; cursor: pointer; font-size:"+square_size/2+"px;";
//         if(grid[i][j] == 1){
//           stimulus += "border: 2px solid black;"
//         }
//         if(typeof target !== 'undefined' && target[0] == i && target[1] == j){
//           stimulus += "background-color: "+target_color+";"
//         }
//         stimulus += "'>";
//         if(typeof labels !=='undefined' && labels[i][j] !== false){
//           stimulus += labels[i][j]
//         }
//         stimulus += "</div>";
//       }
//       stimulus += "</div>";
//     }
//     stimulus += "</div>";

//     return stimulus
//   }

  return plugin;
})();
