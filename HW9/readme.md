# Visualization Overview

## Popularity Distribution: Genres and Artists

At the top of the screen, two graphs illustrate the popularity distribution for genres and artists.

### Genres Popularity Distribution
- **Input Element:** Choose a numeric value to filter genres by popularity.
  - *Positive Value:* Displays genres in increasing order of popularity.
  - *Negative Value:* Displays genres in decreasing order of popularity.

### Artists Popularity Distribution
- **Input Element:** Select a specific number to filter artists based on popularity.
  - *Positive Value:* Shows artists in increasing order of popularity.
  - *Negative Value:* Presents artists in decreasing order of popularity.

## Correlation Heatmap

Below the popularity distribution graphs, a heatmap represents the correlation between 14 columns : 
1. **Popularity**
2. **Duration (ms)**
3. **Danceability**
4. **Energy**
5. **Key**
6. **Loudness**
7. **Mode**
8. **Speechiness**
9. **Acousticness**
10. **Instrumentalness**
11. **Liveness**
12. **Valence**
13. **Tempo**
14. **Time Signature**

- **Interaction:**
  - *Hover:* Reveals column names and correlation values upon hovering over a heatmap region.
  - *Click:* Generates a scatter plot for the selected columns, showcasing regression curves.

## Scatter Plot with Regression Curves

- **Display:** Shown upon clicking a region on the heatmap.
- **Features:** Offers a detailed visualization of the correlation between the chosen columns.
- **Regression Curves:** Highlights trends and patterns in the data.
