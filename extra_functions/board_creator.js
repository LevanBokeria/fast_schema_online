function board_creator(board_size_px,
    n_rows,
    n_cols,
    show_visible_pas,
    show_hidden_pas,
    curr_trial){ 


    debugger
    
    // Create the grid 
    grid_border = document.createElement('div')
    grid_border.id = 'grid_border'

    // grid_border.style['background-image'] = "url(" + border_image_path + ")"
    // grid_border.style['background-size'] = 'contain'
    grid_border.style.height = (board_size_px + 60) + 'px'
    grid_border.style.width  = (board_size_px + 60) + 'px'
      
    // Create the grid box element
    let grid_box = document.createElement('div')
    grid_box.id = 'grid-box'
    grid_box.style = 
        'height:' + board_size_px + 'px;' + 
        'width:' + board_size_px + 'px;' + 
        'grid-template-columns: repeat('+n_cols+', 1fr);' +
        'grid-template-rows: repeat('+n_rows+', 1fr);' +
        // 'border: 10px solid ' + curr_trial.color + ';' + 
        'background-color: '+ curr_trial.color +';' + 
        // 'opacity: 0.4;' +
        'position: absolute;' +
        'top: 50%;' + 
        'left: 50%;' + 
        'transform: translate(-50%, -50%);'

    // Create the cells
    for (ir = 0; ir < n_rows; ir++){

      for (ic = 0; ic < n_cols; ic++){

        iCell = document.createElement('div')

        iCell.className = 'cells'
        iCell.id = 'cell_r_' + (ir+1) + '_c_' + (ic+1)

        // iCell.style = 
        //   'background-color: '+ curr_trial.color +';'
          // 'opacity: 0.4;'
          // 'border-right: 3px solid ' + curr_trial.color + ';' +
          // 'border-bottom: 3px solid ' + curr_trial.color + ';'

        grid_box.appendChild(iCell)

      }
    }

    if (show_visible_pas) {
      var visible_pa_visibility_status = 'visible'
      // var visible_pa_opacity = 1
    } else {
      var visible_pa_visibility_status = 'hidden'
      // var visible_pa_opacity = 0.4
    }
    if (show_hidden_pas) {
      var hidden_pa_visibility_status = 'visible'
      // var visible_pa_opacity = 1
    } else {
      var hidden_pa_visibility_status = 'hidden'
      // var hidden_pa_opacity = 0.4
    }    
      

    // Add the schema-PAs
    for (iImg = 0; iImg < curr_trial.visible_pa_imgs.length; iImg++){

      // Which row and col?
      let i_row = curr_trial.visible_pa_img_coords2[iImg].row
      let i_col = curr_trial.visible_pa_img_coords2[iImg].column

      iEl = document.createElement('img')

      iEl.className = 'PA'
      iEl.id = 'schemaPA_' + (iImg+1)
      iEl.src = curr_trial.visible_pa_imgs[iImg]
      iEl.style = 
      'visibility: ' + visible_pa_visibility_status + ';'

      let nth_child_idx = (i_row-1)*n_cols + i_col
      
      let iCell = grid_box.children[nth_child_idx-1]
      // iCell.style.opacity = visible_pa_opacity

      iCell.appendChild(iEl)

    }


    // Add the new PAs
    for (iImg = 0; iImg < curr_trial.hidden_pa_all_imgs.length; iImg++){

      // Which row and col?
      let i_row = curr_trial.hidden_pa_all_img_coords2[iImg].row
      let i_col = curr_trial.hidden_pa_all_img_coords2[iImg].column

      iEl = document.createElement('img')

      iEl.className = 'PA'
      iEl.id = 'newPA_' + (iImg+1)
      iEl.src = curr_trial.hidden_pa_all_imgs[iImg]
      iEl.style = 
      'visibility: ' + hidden_pa_visibility_status + ';'

      let nth_child_idx = (i_row-1)*n_cols + i_col
      
      let iCell = grid_box.children[nth_child_idx-1]
      // iCell.style.opacity = hidden_pa_opacity
      iCell.appendChild(iEl)

    }

    grid_border.appendChild(grid_box)

    return grid_border
}