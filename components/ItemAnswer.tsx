import { IAnswer, IUserAnswer } from '@/types/Question';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const ItemAnswer = ({
  answer,
  isSelected,
  onPress,
  userAnswer,
  isSubmit,
}: {
  answer: IAnswer;
  isSelected: boolean;
  onPress: () => void;
  userAnswer: IUserAnswer;
  isSubmit: boolean;
}) => {
  const isCorrectAnswer = answer.is_correct;
  const isUserSelected = answer.content === userAnswer.value;

  let borderClass = 'border-secondary';
  let bgClass = '';
  let textClass = 'text-white';
  let dotClass = 'bg-white';
  let iconType: 'check' | 'close' | null = null
  let iconColor = ''

  if (isSubmit) {
    if (isCorrectAnswer) {
      borderClass = 'border-green-500';
      bgClass = 'bg-green-100/10';
      textClass = 'text-green-400';
      dotClass = 'bg-green-500';
      iconType = 'check'
      iconColor = '#22c55e' // tailwind green-500

    } else if (isUserSelected && !isCorrectAnswer) {
      borderClass = 'border-red-500';
      bgClass = 'bg-red-100/10';
      textClass = 'text-red-500';
      dotClass = 'bg-red-500';
      iconType = 'close'
      iconColor = '#ef4444' // tailwind red-500

    }
  } else if (isSelected) {
    borderClass = 'border-green-500';
    bgClass = 'bg-green-100/10';
    textClass = 'text-green-400';
    dotClass = 'bg-green-500';
  }

  return (
    <TouchableOpacity onPress={onPress} disabled={isSubmit}>
      <View className={`rounded-lg p-2 mb-2 border ${borderClass} ${bgClass}`}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className={`w-3 h-3 rounded-full mr-2 ${dotClass}`} />
            <Text className={`${textClass}`}>{answer.content}</Text>
          </View>
          {isSubmit && iconType && (
            <FontAwesome name={iconType} size={18} color={iconColor} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ItemAnswer
