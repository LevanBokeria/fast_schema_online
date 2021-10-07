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

df <- import('./pone.0010773.s001.xls')

df <- df[1:480,]

# Filter out Non living
df_nl <-
        df %>%
        filter(`Living/non-living` == 'NL') %>%
        rename(modal_name = `Modal name`)

df_nl$modal_name_clean <- 
        sapply(df_nl$modal_name, FUN = function(x){
                if (grepl('\\*',x)){
                        return(str_trunc(x,nchar(x)-2,'right',ellipsis = ''))
                } else {
                        return(x)
                }
        })


# Take only unique modal names
df_nl_unique <- 
        df_nl %>%
        distinct(modal_name_clean, .keep_all = TRUE)

# Sort by familiarity
df_nl_unique <-
        df_nl_unique %>%
        arrange(desc(Familiarity))


# Copy 100 of them to a separate folder



# Write as a CSV file
write_csv(df_nl_unique,'./names.csv')
