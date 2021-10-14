pacman::p_load(pacman,
               rio,
               tidyverse,
               rstatix,
               DT,
               kableExtra,
               readr,
               writexl,
               jsonlite,
               stringr,
               gridExtra,
               knitr,
               magrittr,
               Hmisc,
               psycho)

rm(list = ls())

df <- import('./local_version.xlsx')

# Take only unique modal names
df_unique_modal <- 
        df %>%
        distinct(`Modal name`, .keep_all = TRUE)

# Filter out body parts
df_unique_modal <- 
        df_unique_modal %>%
        filter(`Modal category` != 'Bodypart')

# Sort by familiarity
df_unique_modal_sorted <-
        df_unique_modal %>%
        arrange(desc(`Familiarity Mean`))

df_high_fam <- 
        df_unique_modal_sorted %>%
        filter(`Familiarity Mean` >= 4)

# Copy anything with familiarity > 4
df_high_fam %>%
        write_csv('./high_familiarity_images.csv')

## Copy these to a separate folder --------------------------------------------
