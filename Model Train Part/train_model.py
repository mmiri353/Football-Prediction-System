import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, confusion_matrix
import joblib
import pickle
from sklearn.preprocessing import LabelEncoder

# Load data for each season
df2014 = pd.read_csv('laliga2014.csv', encoding='unicode_escape')
df2015 = pd.read_csv('laliga2015.csv', encoding='unicode_escape')
df2016 = pd.read_csv('laliga2016.csv', encoding='unicode_escape')
df2017 = pd.read_csv('laliga2017.csv', encoding='unicode_escape')
df2018 = pd.read_csv('laliga2018.csv', encoding='unicode_escape')
df2019 = pd.read_csv('laliga2019.csv', encoding='unicode_escape')
df2020 = pd.read_csv('laliga2020.csv', encoding='unicode_escape')

# Define feature extraction function
def feature(df):
    h_sc, a_sc, h_co, a_co = [], [], [], []
    for i in range(len(df)):
        score = df['Score'][i].split('-')
        h_sc.append(int(score[0]))
        a_co.append(int(score[0]))
        a_sc.append(int(score[1]))
        h_co.append(int(score[1]))
    df['Home Team Goals Scored'] = h_sc
    df['Away Team Goals Scored'] = a_sc
    df['Home Team Goals Conceded'] = h_co
    df['Away Team Goals Conceded'] = a_co
    return df

# Apply the feature function and add a year column to each dataset
df2014 = feature(df2014)
df2014['year'] = 2014
df2015 = feature(df2015)
df2015['year'] = 2015
df2016 = feature(df2016)
df2016['year'] = 2016
df2017 = feature(df2017)
df2017['year'] = 2017
df2018 = feature(df2018)
df2018['year'] = 2018
df2019 = feature(df2019)
df2019['year'] = 2019
df2020 = feature(df2020)
df2020['year'] = 2020

# Concatenate all datasets into a single DataFrame
final_data = pd.concat([df2014, df2015, df2016, df2017, df2018, df2019, df2020])
final_data.reset_index(drop=True, inplace=True)

# Determine points based on game outcome
home_points, away_points = [], []
for i in range(len(final_data)):
    if final_data['Home Team Goals Scored'][i] > final_data['Away Team Goals Scored'][i]:
        home_points.append(3)
        away_points.append(0)
    elif final_data['Home Team Goals Scored'][i] < final_data['Away Team Goals Scored'][i]:
        away_points.append(3)
        home_points.append(0)
    else:
        away_points.append(1)
        home_points.append(1)

final_data['Home Points'] = home_points
final_data['Away Points'] = away_points




team_encoder = LabelEncoder()
final_data['Home Team Encoded'] = team_encoder.fit_transform(final_data['Home Team'])
final_data['Away Team Encoded'] = team_encoder.transform(final_data['Away Team'])

# Check if encoding was successful
print(final_data[['Home Team', 'Home Team Encoded', 'Away Team', 'Away Team Encoded']].head())


# target variable
X = final_data[['Home Team Encoded', 'Away Team Encoded', 'Match Excitement',
                'Home Team Rating', 'Away Team Rating',
                'Home Team Possession %', 'Away Team Possession %',
                'Home Team Off Target Shots', 'Home Team On Target Shots',
                'Home Team Total Shots', 'Home Team Blocked Shots', 'Home Team Corners',
                'Home Team Throw Ins', 'Home Team Pass Success %',
                'Home Team Aerials Won', 'Home Team Clearances', 'Home Team Fouls',
                'Home Team Yellow Cards', 'Home Team Second Yellow Cards',
                'Home Team Red Cards', 'Away Team Off Target Shots',
                'Away Team On Target Shots', 'Away Team Total Shots',
                'Away Team Blocked Shots', 'Away Team Corners', 'Away Team Throw Ins',
                'Away Team Pass Success %', 'Away Team Aerials Won',
                'Away Team Clearances', 'Away Team Fouls', 'Away Team Yellow Cards',
                'Away Team Second Yellow Cards', 'Away Team Red Cards', 'year']]
y = final_data['Home Points']

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=101)

# Initialize and train the Decision Tree model
model = DecisionTreeClassifier(max_depth=6)
model.fit(X_train, y_train)

# Make predictions and evaluate the model
pred = model.predict(X_test)
print('Accuracy:', accuracy_score(y_test, pred))
print('Confusion Matrix:')
print(confusion_matrix(y_test, pred))
print('Training Accuracy:', model.score(X_train, y_train))

import joblib

print(team_encoder.classes_)


# Save the model using joblib
#joblib.dump(model, 'decision_tree_model.pkl')
